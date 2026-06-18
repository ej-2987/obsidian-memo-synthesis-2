'use strict';

var obsidian = require('obsidian');

// ──────────────────────────────────────────────
// CONSTANTS
// ──────────────────────────────────────────────

const DEFAULT_SETTINGS = {
    provider: 'gemini',
    geminiApiKey: '',
    geminiModel: 'gemini-2.5-flash',
    claudeApiKey: '',
    claudeModel: 'claude-sonnet-4-6',
    perplexityApiKey: '',
    perplexityModel: 'sonar',
    openaiApiKey: '',
    openaiModel: 'gpt-4o',
};

const MODELS = {
    gemini: [
        { id: 'gemini-2.5-pro-preview-05-06', name: 'Gemini 2.5 Pro' },
        { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (추천)' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    ],
    claude: [
        { id: 'claude-opus-4-7', name: 'Claude Opus 4.7 (최고 성능)' },
        { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6 (추천)' },
        { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5 (빠름)' },
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
    ],
    perplexity: [
        { id: 'sonar-pro', name: 'Sonar Pro (최고 성능)' },
        { id: 'sonar', name: 'Sonar (추천)' },
        { id: 'sonar-reasoning-pro', name: 'Sonar Reasoning Pro' },
        { id: 'sonar-reasoning', name: 'Sonar Reasoning' },
    ],
    openai: [
        { id: 'gpt-4o', name: 'GPT-4o (추천)' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini (빠름)' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    ],
};

// ──────────────────────────────────────────────
// MODAL: 트리거/형식 선택용 (FuzzySuggest)
// ──────────────────────────────────────────────

class MemoSuggesterModal extends obsidian.FuzzySuggestModal {
    constructor(app, items, displayItems, placeholder) {
        super(app);
        this._items = items;
        this._displayItems = displayItems;
        this._resolve = null;
        this._chosen = false;
        if (placeholder) this.setPlaceholder(placeholder);
    }

    getItems() { return this._items; }

    getItemText(item) {
        const i = this._items.indexOf(item);
        return i >= 0 ? this._displayItems[i] : '';
    }

    onChooseItem(item) {
        this._chosen = true;
        if (this._resolve) { this._resolve(item); this._resolve = null; }
    }

    onClose() {
        setTimeout(() => {
            if (!this._chosen && this._resolve) { this._resolve(null); this._resolve = null; }
        }, 50);
    }

    wait() {
        return new Promise(r => { this._resolve = r; this.open(); });
    }
}

// ──────────────────────────────────────────────
// MODAL: 텍스트 입력
// ──────────────────────────────────────────────

class MemoPromptModal extends obsidian.Modal {
    constructor(app, title, placeholder, defaultVal) {
        super(app);
        this._title = title;
        this._placeholder = placeholder || '';
        this._default = defaultVal || '';
        this._resolve = null;
        this._done = false;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h3', { text: this._title });

        const ta = contentEl.createEl('textarea');
        Object.assign(ta.style, {
            width: '100%', minHeight: '90px', padding: '8px',
            boxSizing: 'border-box', marginBottom: '10px',
            fontFamily: 'var(--font-text)', fontSize: 'var(--font-ui-medium)',
            resize: 'vertical', borderRadius: '4px',
        });
        ta.placeholder = this._placeholder;
        ta.value = this._default;

        const row = contentEl.createEl('div');
        Object.assign(row.style, { display: 'flex', gap: '8px', justifyContent: 'flex-end' });

        const ok = row.createEl('button', { text: '확인', cls: 'mod-cta' });
        const cancel = row.createEl('button', { text: '취소' });

        const finish = (val) => {
            if (this._done) return;
            this._done = true;
            if (this._resolve) { this._resolve(val); this._resolve = null; }
            this.close();
        };

        ok.addEventListener('click', () => finish(ta.value.trim() || null));
        cancel.addEventListener('click', () => finish(null));
        ta.addEventListener('keydown', e => { if (e.key === 'Enter' && e.ctrlKey) finish(ta.value.trim() || null); });

        setTimeout(() => ta.focus(), 10);
    }

    onClose() {
        if (!this._done && this._resolve) { this._resolve(null); this._resolve = null; }
        this.contentEl.empty();
    }

    wait() {
        return new Promise(r => { this._resolve = r; this.open(); });
    }
}

// ──────────────────────────────────────────────
// MODAL: 메모 선택 (검색 + 폴더 트리)
// multi=true  → TFile[] 반환
// multi=false → TFile  반환 (클릭하면 바로 선택)
// ──────────────────────────────────────────────

class MemoPickerModal extends obsidian.Modal {
    constructor(app, files, title, multi = true) {
        super(app);
        this._allFiles = files;
        this._title = title;
        this._multi = multi;
        this._selected = new Set();
        this._resolve = null;
        this._done = false;
        this._searchTerm = '';
        this._listEl = null;
        this._expanded = {};
    }

    onOpen() {
        const { contentEl } = this;
        Object.assign(contentEl.style, { padding: '16px', minWidth: '480px' });

        const h = contentEl.createEl('h3', { text: this._title });
        Object.assign(h.style, { marginTop: '0', marginBottom: '10px' });

        const searchInput = contentEl.createEl('input');
        Object.assign(searchInput, { type: 'text', placeholder: '🔍 메모 제목으로 검색...' });
        Object.assign(searchInput.style, {
            width: '100%', padding: '8px 12px', boxSizing: 'border-box',
            borderRadius: '6px', border: '1px solid var(--background-modifier-border)',
            fontSize: 'var(--font-ui-medium)', background: 'var(--background-primary)',
            marginBottom: '8px',
        });

        this._listEl = contentEl.createEl('div');
        Object.assign(this._listEl.style, {
            maxHeight: '420px', overflowY: 'auto',
            border: '1px solid var(--background-modifier-border)',
            borderRadius: '6px', padding: '4px', marginBottom: '10px',
        });

        this._renderList();

        searchInput.addEventListener('input', e => {
            this._searchTerm = e.target.value.trim().toLowerCase();
            this._renderList();
        });

        setTimeout(() => searchInput.focus(), 10);

        if (this._multi) {
            const footer = contentEl.createEl('div');
            Object.assign(footer.style, { display: 'flex', gap: '8px', justifyContent: 'flex-end' });
            const ok = footer.createEl('button', { text: '확인', cls: 'mod-cta' });
            const cancel = footer.createEl('button', { text: '취소' });
            ok.addEventListener('click', () => {
                this._finish(this._allFiles.filter(f => this._selected.has(f.path)));
            });
            cancel.addEventListener('click', () => this._finish([]));
        } else {
            const hint = contentEl.createEl('p', { text: '메모를 클릭하면 바로 선택됩니다.' });
            Object.assign(hint.style, {
                color: 'var(--text-muted)', fontSize: '0.82em', margin: '0', textAlign: 'right',
            });
        }
    }

    _finish(result) {
        if (this._done) return;
        this._done = true;
        if (this._resolve) { this._resolve(result); this._resolve = null; }
        this.close();
    }

    _renderList() {
        this._listEl.empty();
        if (this._searchTerm) {
            this._renderSearchResults();
        } else {
            this._renderFolderTree();
        }
    }

    _renderSearchResults() {
        const filtered = this._allFiles.filter(f =>
            f.basename.toLowerCase().includes(this._searchTerm)
        );

        if (!filtered.length) {
            const empty = this._listEl.createEl('div', { text: '검색 결과가 없습니다.' });
            Object.assign(empty.style, {
                padding: '20px', textAlign: 'center', color: 'var(--text-muted)',
            });
            return;
        }

        for (const file of filtered) {
            this._renderFileRow(this._listEl, file, 0, true);
        }
    }

    _buildTree(files) {
        const root = { files: [], children: {} };
        for (const file of files) {
            const parts = file.path.split('/');
            parts.pop();
            let node = root;
            let cur = '';
            for (const part of parts) {
                cur = cur ? `${cur}/${part}` : part;
                if (!node.children[part]) {
                    node.children[part] = { name: part, path: cur, files: [], children: {} };
                }
                node = node.children[part];
            }
            node.files.push(file);
        }
        return root;
    }

    _countAll(node) {
        let n = node.files.length;
        for (const c of Object.values(node.children)) n += this._countAll(c);
        return n;
    }

    _renderFolderTree() {
        const tree = this._buildTree(this._allFiles);
        this._renderNode(this._listEl, tree, 0);
    }

    _renderNode(containerEl, node, depth) {
        const sortedFiles = [...node.files].sort((a, b) => a.basename.localeCompare(b.basename));
        for (const file of sortedFiles) {
            this._renderFileRow(containerEl, file, depth, false);
        }

        const sortedFolders = Object.values(node.children)
            .sort((a, b) => a.name.localeCompare(b.name));

        for (const child of sortedFolders) {
            const isExpanded = this._expanded[child.path] !== false;

            const folderRow = containerEl.createEl('div');
            Object.assign(folderRow.style, {
                display: 'flex', alignItems: 'center', cursor: 'pointer',
                padding: `5px 8px 5px ${8 + depth * 18}px`,
                borderRadius: '4px', userSelect: 'none',
            });
            folderRow.addEventListener('mouseenter', () => folderRow.style.background = 'var(--background-modifier-hover)');
            folderRow.addEventListener('mouseleave', () => folderRow.style.background = 'transparent');

            const arrow = folderRow.createEl('span');
            Object.assign(arrow.style, {
                fontSize: '0.7em', marginRight: '5px', width: '10px',
                display: 'inline-block', color: 'var(--text-muted)',
            });
            arrow.textContent = isExpanded ? '▾' : '▸';

            const folderName = folderRow.createEl('span', { text: '📁 ' + child.name });
            folderName.style.fontWeight = '600';

            const count = folderRow.createEl('span', { text: ` (${this._countAll(child)})` });
            Object.assign(count.style, { color: 'var(--text-muted)', fontSize: '0.8em', marginLeft: '4px' });

            const childContainer = containerEl.createEl('div');
            childContainer.style.display = isExpanded ? 'block' : 'none';

            if (isExpanded) this._renderNode(childContainer, child, depth + 1);
            let rendered = isExpanded;

            folderRow.addEventListener('click', () => {
                const nowExpanded = this._expanded[child.path] !== false;
                this._expanded[child.path] = !nowExpanded;
                const opening = !nowExpanded;
                childContainer.style.display = opening ? 'block' : 'none';
                arrow.textContent = opening ? '▾' : '▸';
                if (opening && !rendered) {
                    this._renderNode(childContainer, child, depth + 1);
                    rendered = true;
                }
            });
        }
    }

    _renderFileRow(containerEl, file, depth, showPath) {
        const isSelected = this._selected.has(file.path);

        const row = containerEl.createEl('div');
        Object.assign(row.style, {
            display: 'flex', alignItems: 'center', cursor: 'pointer',
            padding: `5px 10px 5px ${10 + depth * 18}px`,
            borderRadius: '4px', gap: '8px',
            background: isSelected ? 'var(--interactive-accent-hover)' : 'transparent',
        });

        row.addEventListener('mouseenter', () => {
            if (!this._selected.has(file.path)) row.style.background = 'var(--background-modifier-hover)';
        });
        row.addEventListener('mouseleave', () => {
            row.style.background = this._selected.has(file.path)
                ? 'var(--interactive-accent-hover)' : 'transparent';
        });

        if (this._multi) {
            const cb = row.createEl('input');
            cb.type = 'checkbox';
            cb.checked = isSelected;
            Object.assign(cb.style, { flexShrink: '0', cursor: 'pointer', pointerEvents: 'none' });

            const textWrap = row.createEl('div');
            textWrap.style.flex = '1';
            textWrap.createEl('div', { text: '📝 ' + file.basename });
            if (showPath) {
                const parts = file.path.split('/');
                parts.pop();
                if (parts.length) {
                    const pathEl = textWrap.createEl('div', { text: '📁 ' + parts.join(' › ') });
                    Object.assign(pathEl.style, { fontSize: '0.78em', color: 'var(--text-muted)' });
                }
            }

            row.addEventListener('click', () => {
                if (this._selected.has(file.path)) {
                    this._selected.delete(file.path);
                    cb.checked = false;
                    row.style.background = 'transparent';
                } else {
                    this._selected.add(file.path);
                    cb.checked = true;
                    row.style.background = 'var(--interactive-accent-hover)';
                }
            });
        } else {
            const textWrap = row.createEl('div');
            textWrap.style.flex = '1';
            textWrap.createEl('div', { text: '📝 ' + file.basename });
            if (showPath) {
                const parts = file.path.split('/');
                parts.pop();
                if (parts.length) {
                    const pathEl = textWrap.createEl('div', { text: '📁 ' + parts.join(' › ') });
                    Object.assign(pathEl.style, { fontSize: '0.78em', color: 'var(--text-muted)' });
                }
            }
            row.addEventListener('click', () => this._finish(file));
        }
    }

    onClose() {
        if (!this._done && this._resolve) {
            this._resolve(this._multi ? [] : null);
            this._resolve = null;
        }
        this.contentEl.empty();
    }

    wait() {
        return new Promise(r => { this._resolve = r; this.open(); });
    }
}

// ──────────────────────────────────────────────
// MODAL: 검색 결과 점수 목록에서 선택
// ──────────────────────────────────────────────

class MemoScoreSelectModal extends obsidian.Modal {
    constructor(app, scoredItems, title) {
        super(app);
        this._items = scoredItems;
        this._title = title;
        this._selected = new Set();
        this._resolve = null;
        this._done = false;
        this._searchTerm = '';
    }

    onOpen() {
        const { contentEl } = this;
        Object.assign(contentEl.style, { padding: '16px', minWidth: '460px' });

        contentEl.createEl('h3', { text: this._title }).style.marginTop = '0';

        const hint = contentEl.createEl('p', { text: '관련도 점수 기준 정렬. 체크 후 확인을 누르세요.' });
        Object.assign(hint.style, { color: 'var(--text-muted)', fontSize: '0.83em', marginTop: '0' });

        const searchInput = contentEl.createEl('input');
        Object.assign(searchInput, { type: 'text', placeholder: '🔍 제목으로 필터...' });
        Object.assign(searchInput.style, {
            width: '100%', padding: '7px 10px', boxSizing: 'border-box',
            borderRadius: '6px', border: '1px solid var(--background-modifier-border)',
            fontSize: 'var(--font-ui-medium)', background: 'var(--background-primary)',
            marginBottom: '8px',
        });

        this._listEl = contentEl.createEl('div');
        Object.assign(this._listEl.style, {
            maxHeight: '380px', overflowY: 'auto',
            border: '1px solid var(--background-modifier-border)',
            borderRadius: '6px', padding: '4px', marginBottom: '10px',
        });
        this._renderItems();

        searchInput.addEventListener('input', e => {
            this._searchTerm = e.target.value.trim().toLowerCase();
            this._renderItems();
        });

        const footer = contentEl.createEl('div');
        Object.assign(footer.style, { display: 'flex', gap: '8px', justifyContent: 'flex-end' });
        const ok = footer.createEl('button', { text: '확인', cls: 'mod-cta' });
        const cancel = footer.createEl('button', { text: '취소' });

        ok.addEventListener('click', () => {
            this._finish(this._items.filter(item => this._selected.has(item.file.path)));
        });
        cancel.addEventListener('click', () => this._finish([]));

        setTimeout(() => searchInput.focus(), 10);
    }

    _renderItems() {
        this._listEl.empty();
        const filtered = this._searchTerm
            ? this._items.filter(item => item.file.basename.toLowerCase().includes(this._searchTerm))
            : this._items;

        if (!filtered.length) {
            this._listEl.createEl('div', { text: '결과 없음' }).style.cssText =
                'padding:16px;text-align:center;color:var(--text-muted);';
            return;
        }

        for (const item of filtered) {
            const key = item.file.path;
            const row = this._listEl.createEl('div');
            Object.assign(row.style, {
                display: 'flex', alignItems: 'center', cursor: 'pointer',
                padding: '6px 10px', borderRadius: '4px', gap: '8px',
                background: this._selected.has(key) ? 'var(--interactive-accent-hover)' : 'transparent',
            });
            row.addEventListener('mouseenter', () => {
                if (!this._selected.has(key)) row.style.background = 'var(--background-modifier-hover)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.background = this._selected.has(key) ? 'var(--interactive-accent-hover)' : 'transparent';
            });

            const cb = row.createEl('input');
            cb.type = 'checkbox';
            cb.checked = this._selected.has(key);
            Object.assign(cb.style, { flexShrink: '0', cursor: 'pointer', pointerEvents: 'none' });

            const scoreEl = row.createEl('span', { text: `${item.score}점` });
            Object.assign(scoreEl.style, {
                color: 'var(--text-accent)', fontSize: '0.78em', fontWeight: '600',
                minWidth: '36px', textAlign: 'right', flexShrink: '0',
            });

            const nameWrap = row.createEl('div');
            nameWrap.style.flex = '1';
            nameWrap.createEl('div', { text: item.file.basename });
            const parts = item.file.path.split('/');
            parts.pop();
            if (parts.length) {
                const p = nameWrap.createEl('div', { text: '📁 ' + parts.join(' › ') });
                Object.assign(p.style, { fontSize: '0.76em', color: 'var(--text-muted)' });
            }

            row.addEventListener('click', () => {
                if (this._selected.has(key)) {
                    this._selected.delete(key);
                    cb.checked = false;
                    row.style.background = 'transparent';
                } else {
                    this._selected.add(key);
                    cb.checked = true;
                    row.style.background = 'var(--interactive-accent-hover)';
                }
            });
        }
    }

    _finish(result) {
        if (this._done) return;
        this._done = true;
        if (this._resolve) { this._resolve(result); this._resolve = null; }
        this.close();
    }

    onClose() {
        if (!this._done && this._resolve) { this._resolve([]); this._resolve = null; }
        this.contentEl.empty();
    }

    wait() {
        return new Promise(r => { this._resolve = r; this.open(); });
    }
}

// ──────────────────────────────────────────────
// SETTINGS TAB
// ──────────────────────────────────────────────

class MemoSynthesisSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: '메모 통합 발전 설정' });

        // API 키 안내 배너
        const banner = containerEl.createEl('div');
        Object.assign(banner.style, {
            background: 'var(--background-modifier-error)',
            border: '1px solid var(--background-modifier-error-hover)',
            borderRadius: '6px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '0.88em',
            color: 'var(--text-normal)',
        });
        banner.createEl('strong', { text: '🔒 보안 안내: ' });
        banner.appendText('API 키는 이 설정창에서만 입력하세요. 키는 Obsidian 내부 저장소에만 보관되며 외부로 전송되지 않습니다.');

        new obsidian.Setting(containerEl)
            .setName('기본 AI 제공자')
            .setDesc('메모 발전에 사용할 AI API를 선택합니다.')
            .addDropdown(dd => dd
                .addOption('gemini', '🔵 Google Gemini')
                .addOption('claude', '🟠 Anthropic Claude')
                .addOption('perplexity', '🟣 Perplexity AI')
                .addOption('openai', '🟢 OpenAI')
                .setValue(this.plugin.settings.provider)
                .onChange(async v => {
                    this.plugin.settings.provider = v;
                    await this.plugin.saveSettings();
                    this.display();
                })
            );

        const p = this.plugin.settings.provider;
        const pLabel = { gemini: 'Gemini', claude: 'Claude', perplexity: 'Perplexity', openai: 'OpenAI' }[p];
        containerEl.createEl('p', {
            text: `현재 선택: ${pLabel} — ${this.plugin.getCurrentModelName()}`,
        }).style.cssText = 'color:var(--text-accent);margin-top:-8px;font-size:0.9em;';

        this._section(containerEl, '🔵 Google Gemini', [
            { name: 'Gemini API 키', desc: 'Google AI Studio (aistudio.google.com)에서 발급', key: 'geminiApiKey', placeholder: 'AIza...' },
        ], 'geminiModel', MODELS.gemini);

        this._section(containerEl, '🟠 Anthropic Claude', [
            { name: 'Claude API 키', desc: 'console.anthropic.com에서 발급', key: 'claudeApiKey', placeholder: 'sk-ant-...' },
        ], 'claudeModel', MODELS.claude);

        this._section(containerEl, '🟣 Perplexity AI', [
            { name: 'Perplexity API 키', desc: 'perplexity.ai/settings/api에서 발급', key: 'perplexityApiKey', placeholder: 'pplx-...' },
        ], 'perplexityModel', MODELS.perplexity);

        this._section(containerEl, '🟢 OpenAI', [
            { name: 'OpenAI API 키', desc: 'platform.openai.com에서 발급', key: 'openaiApiKey', placeholder: 'sk-...' },
        ], 'openaiModel', MODELS.openai);
    }

    _section(containerEl, title, fields, modelKey, models) {
        containerEl.createEl('h3', { text: title });
        for (const f of fields) {
            new obsidian.Setting(containerEl)
                .setName(f.name)
                .setDesc(f.desc)
                .addText(t => {
                    t.setPlaceholder(f.placeholder)
                     .setValue(this.plugin.settings[f.key])
                     .onChange(async v => {
                         this.plugin.settings[f.key] = v.trim();
                         await this.plugin.saveSettings();
                     });
                    // 비밀번호처럼 마스킹
                    t.inputEl.type = 'password';
                    t.inputEl.style.fontFamily = 'monospace';
                    t.inputEl.style.width = '100%';
                });
        }
        new obsidian.Setting(containerEl)
            .setName('모델')
            .addDropdown(dd => {
                for (const m of models) dd.addOption(m.id, m.name);
                dd.setValue(this.plugin.settings[modelKey])
                  .onChange(async v => { this.plugin.settings[modelKey] = v; await this.plugin.saveSettings(); this.display(); });
            });
    }
}

// ──────────────────────────────────────────────
// MAIN PLUGIN
// ──────────────────────────────────────────────

class MemoSynthesisPlugin extends obsidian.Plugin {
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new MemoSynthesisSettingTab(this.app, this));

        this.addCommand({
            id: 'run-memo-synthesis',
            name: '메모 통합 발전 실행',
            callback: () => this.runSynthesis(),
        });

        this.addCommand({
            id: 'run-memo-synthesis-switch-api',
            name: '메모 통합 발전 (API 선택 후 실행)',
            callback: () => this.runSynthesisWithApiSelect(),
        });

        this.addRibbonIcon('brain', '메모 통합 발전', () => this.runSynthesis());
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    getApiKey() {
        const { provider, geminiApiKey, claudeApiKey, perplexityApiKey, openaiApiKey } = this.settings;
        return { gemini: geminiApiKey, claude: claudeApiKey, perplexity: perplexityApiKey, openai: openaiApiKey }[provider] || '';
    }

    getCurrentModelName() {
        const { provider } = this.settings;
        const modelId = this.settings[provider + 'Model'];
        const found = (MODELS[provider] || []).find(m => m.id === modelId);
        return found ? found.name : modelId;
    }

    // ── API Calls ──────────────────────────────

    async callGemini(prompt, apiKey, model, compact) {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        maxOutputTokens: compact ? 80 : 8192,
                        temperature: compact ? 0.2 : 0.7,
                    },
                }),
            }
        );
        const data = await res.json();
        if (data.error) throw new Error('Gemini: ' + data.error.message);
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    }

    async callClaude(prompt, apiKey, model, compact) {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model,
                max_tokens: compact ? 100 : 8192,
                messages: [{ role: 'user', content: prompt }],
            }),
        });
        const data = await res.json();
        if (data.error) throw new Error('Claude: ' + (data.error.message || JSON.stringify(data.error)));
        return data.content?.[0]?.text?.trim() || '';
    }

    async callPerplexity(prompt, apiKey, model) {
        const res = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 4096,
            }),
        });
        const data = await res.json();
        if (data.error) throw new Error('Perplexity: ' + (data.error.message || JSON.stringify(data.error)));
        return data.choices?.[0]?.message?.content?.trim() || '';
    }

    async callOpenAI(prompt, apiKey, model, compact) {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: compact ? 100 : 4096,
                temperature: compact ? 0.2 : 0.7,
            }),
        });
        const data = await res.json();
        if (data.error) throw new Error('OpenAI: ' + data.error.message);
        return data.choices?.[0]?.message?.content?.trim() || '';
    }

    async callAPI(prompt, compact = false) {
        const { provider, geminiModel, claudeModel, perplexityModel, openaiModel } = this.settings;
        const apiKey = this.getApiKey();
        if (!apiKey) throw new Error(`${provider} API 키가 설정되지 않았습니다. 플러그인 설정(⚙️)에서 입력하세요.`);

        if (provider === 'gemini')     return this.callGemini(prompt, apiKey, geminiModel, compact);
        if (provider === 'claude')     return this.callClaude(prompt, apiKey, claudeModel, compact);
        if (provider === 'perplexity') return this.callPerplexity(prompt, apiKey, perplexityModel);
        if (provider === 'openai')     return this.callOpenAI(prompt, apiKey, openaiModel, compact);
        throw new Error('알 수 없는 API 제공자');
    }

    async extractTopic(text) {
        const prompt = `다음 텍스트에서 핵심 주제를 한국어로 15자 이내의 명사구 하나로만 추출하세요. 설명 없이 주제어만 출력하세요.\n\n${text.slice(0, 2000)}`;
        try { return await this.callAPI(prompt, true); }
        catch (e) { return ''; }
    }

    // ── UI Helpers ─────────────────────────────

    suggest(displays, values, placeholder) {
        return new MemoSuggesterModal(this.app, values, displays, placeholder).wait();
    }

    prompt(title, placeholder, defaultVal) {
        return new MemoPromptModal(this.app, title, placeholder, defaultVal).wait();
    }

    // ── Related Memo Discovery ─────────────────

    async findRelatedMemos(resultText, excludePaths) {
        const words = (resultText.match(/[가-힣]{2,}|[a-zA-Z]{4,}/g) || []);
        const freq = {};
        for (const w of words) { const k = w.toLowerCase(); freq[k] = (freq[k] || 0) + 1; }
        const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([w]) => w);

        const excl = new Set(excludePaths);
        const related = [];

        for (const file of this.app.vault.getMarkdownFiles()) {
            if (excl.has(file.path)) continue;
            const name = file.basename.toLowerCase();
            const cache = this.app.metadataCache.getFileCache(file);
            const tags = (cache?.tags || []).map(t => t.tag.toLowerCase());
            let score = 0;
            for (const w of topWords) {
                if (name.includes(w)) score += 3;
                if (tags.some(t => t.includes(w))) score += 2;
            }
            if (score > 0) related.push({ file, score });
        }
        return related.sort((a, b) => b.score - a.score).slice(0, 8);
    }

    // ── API 선택 후 실행 ─────────────────────────

    async runSynthesisWithApiSelect() {
        const providerChoice = await this.suggest(
            ['🔵 Google Gemini', '🟠 Anthropic Claude', '🟣 Perplexity AI', '🟢 OpenAI'],
            ['gemini', 'claude', 'perplexity', 'openai'],
            'AI 제공자 선택'
        );
        if (!providerChoice) return;

        const modelList = MODELS[providerChoice];
        const modelChoice = await this.suggest(
            modelList.map(m => m.name),
            modelList.map(m => m.id),
            '모델 선택'
        );
        if (!modelChoice) return;

        const prevProvider = this.settings.provider;
        const prevModel = this.settings[providerChoice + 'Model'];
        this.settings.provider = providerChoice;
        this.settings[providerChoice + 'Model'] = modelChoice;

        try { await this.runSynthesis(); }
        finally {
            this.settings.provider = prevProvider;
            this.settings[providerChoice + 'Model'] = prevModel;
        }
    }

    // ── Main Workflow ──────────────────────────

    async runSynthesis() {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            new obsidian.Notice(`❌ ${this.settings.provider} API 키를 플러그인 설정에서 입력하세요.`);
            return;
        }

        const providerLabel = { gemini: 'Gemini', claude: 'Claude', perplexity: 'Perplexity', openai: 'OpenAI' }[this.settings.provider];
        new obsidian.Notice(`✅ ${providerLabel} — ${this.getCurrentModelName()}`, 2000);

        // ① 트리거 방식 선택
        const triggerMode = await this.suggest(
            ['✏️ 주제 직접 입력', '📰 뉴스/텍스트 붙여넣기', '📄 메모 하나 선택', '🗂️ 메모 여러 개 → 주제 자동 추출'],
            ['text', 'news', 'single_memo', 'multi_memo'],
            '트리거 방식을 선택하세요'
        );
        if (!triggerMode) { new obsidian.Notice('취소되었습니다.'); return; }

        let topic = '';
        let seedContent = '';
        let selectedFiles = [];
        let skipSearch = false;

        // ── 모드 1: 주제 직접 입력
        if (triggerMode === 'text') {
            topic = await this.prompt('주제 입력', '예: 푸코 권력, 감시사회, 관료제');
            if (!topic) { new obsidian.Notice('취소되었습니다.'); return; }

        // ── 모드 2: 뉴스/텍스트
        } else if (triggerMode === 'news') {
            const pasted = await this.prompt('텍스트 붙여넣기', '뉴스, 논문 초록, 인용문 등 (Ctrl+Enter로 확인)');
            if (!pasted) { new obsidian.Notice('❌ 텍스트가 없습니다.'); return; }
            seedContent = pasted;

            new obsidian.Notice('🤖 주제를 추출 중...');
            topic = await this.extractTopic(pasted);

            if (!topic) {
                topic = await this.prompt('주제 자동 추출 실패. 직접 입력하세요', '');
                if (!topic) { new obsidian.Notice('취소되었습니다.'); return; }
            } else {
                new obsidian.Notice(`📌 추출된 주제: ${topic}`);
            }

        // ── 모드 3: 메모 하나 선택
        } else if (triggerMode === 'single_memo') {
            const allFiles = this.app.vault.getMarkdownFiles();
            if (!allFiles.length) { new obsidian.Notice('❌ 볼트에 메모가 없습니다.'); return; }

            const chosen = await new MemoPickerModal(this.app, allFiles, '메모를 선택하세요', false).wait();
            if (!chosen) { new obsidian.Notice('❌ 메모를 선택하지 않았습니다.'); return; }

            const content = await this.app.vault.read(chosen);
            selectedFiles = [{ file: chosen, content, score: 0 }];
            seedContent = content;
            topic = chosen.basename;
            skipSearch = true;
            new obsidian.Notice(`📄 선택됨: ${topic}`);

        // ── 모드 4: 메모 여러 개 → 주제 자동 추출
        } else if (triggerMode === 'multi_memo') {
            const allFiles = this.app.vault.getMarkdownFiles();
            if (!allFiles.length) { new obsidian.Notice('❌ 볼트에 메모가 없습니다.'); return; }

            const picked = await new MemoPickerModal(this.app, allFiles, '메모 선택 (여러 개 선택 가능)', true).wait();
            if (!picked.length) { new obsidian.Notice('❌ 메모를 선택하지 않았습니다.'); return; }

            const readResults = await Promise.all(
                picked.map(async file => ({
                    file,
                    content: await this.app.vault.read(file),
                    score: 0,
                }))
            );
            selectedFiles = readResults;

            const combinedPreview = readResults
                .map(r => `## ${r.file.basename}\n${r.content.slice(0, 600)}`)
                .join('\n\n');
            seedContent = combinedPreview;

            new obsidian.Notice('🤖 공통 주제를 추출 중...');
            topic = await this.extractTopic(combinedPreview);

            if (!topic) {
                topic = await this.prompt('주제 자동 추출 실패. 직접 입력하세요', '');
                if (!topic) { new obsidian.Notice('취소되었습니다.'); return; }
            } else {
                new obsidian.Notice(`📌 추출된 공통 주제: ${topic}`);
            }
            skipSearch = true;
        }

        const keywords = topic.split(/[,\s]+/).filter(k => k.length > 1);

        // ② 연관 메모 검색 (text / news 모드만)
        if (!skipSearch) {
            new obsidian.Notice('🔍 연관 메모를 검색 중...');

            const scoredFiles = [];
            for (const file of this.app.vault.getMarkdownFiles()) {
                const content = await this.app.vault.read(file);
                const cache = this.app.metadataCache.getFileCache(file);
                const tags = (cache?.tags || []).map(t => t.tag.toLowerCase());
                const fileName = file.basename.toLowerCase();
                const contentLower = content.toLowerCase();

                let score = 0;
                for (const kw of keywords) {
                    const k = kw.toLowerCase();
                    if (fileName.includes(k)) score += 3;
                    if (tags.some(t => t.includes(k))) score += 2;
                    score += Math.min((contentLower.match(new RegExp(k, 'g')) || []).length, 5);
                }
                if (score > 0) scoredFiles.push({ file, content, score });
            }

            scoredFiles.sort((a, b) => b.score - a.score);

            if (!scoredFiles.length) {
                new obsidian.Notice('❌ 연관 메모를 찾지 못했습니다. 주제를 바꿔보세요.');
                return;
            }

            // ③ 검색 결과에서 선택
            const picked = await new MemoScoreSelectModal(
                this.app,
                scoredFiles.slice(0, 15),
                `연관 메모 선택 (관련도순)`
            ).wait();

            if (!picked.length) { new obsidian.Notice('❌ 메모를 선택하지 않았습니다.'); return; }
            selectedFiles = picked;
        }

        // ④ 출력 형식 선택
        const format = await this.suggest(
            ['📄 LEET 언어이해 지문', '📋 수사기획 보고서', '✍️ 기고문/에세이', '🔗 심화 통합 메모', '💡 개념 정리 노트'],
            ['leet', 'report', 'article', 'synthesis', 'concept'],
            '출력 형식을 선택하세요'
        );
        if (!format) { new obsidian.Notice('취소되었습니다.'); return; }

        const formatPrompts = {
            leet: `다음 메모들의 내용을 바탕으로 '${topic}' 주제의 LEET 언어이해 지문을 작성하세요.\n- 800~1000자 분량의 밀도 있는 학술 지문\n- 단일한 논지를 향해 논리적으로 전개\n- 지문 후 독해 문제 3개 포함 (선지 5개씩)\n- 생소한 개념도 지문 안에서 자연스럽게 정의`,
            report: `다음 메모들의 내용을 바탕으로 '${topic}' 주제의 수사기획 보고서를 작성하세요.\n- 형식: 제목 / 개요 / 현황 및 문제점 / 원인 분석 / 개선방안 / 기대효과\n- 공문서 문체 사용, 항목화된 구조\n- 근거와 논리가 명확하게 드러나도록 작성`,
            article: `다음 메모들의 내용을 바탕으로 '${topic}' 주제의 기고문을 작성하세요.\n- 전문 독자를 대상으로 한 깊이 있는 에세이\n- 도입부에서 문제의식 제시, 본론에서 논증, 결론에서 통찰 제시\n- 개인적 관점과 학문적 근거가 균형 있게 결합`,
            synthesis: `다음 메모들의 핵심 개념들을 연결하고 발전시켜 '${topic}'에 관한 심화 메모를 작성하세요.\n- 각 메모 간의 공통점, 긴장관계, 상호보완 관계를 명시적으로 분석\n- 각 메모의 핵심 주장을 인용하며 새로운 종합적 관점 제시\n- 기존 메모에서 한 단계 더 나아간 새로운 통찰 제시\n- 추가로 탐구할 질문들도 포함`,
            concept: `다음 메모들을 바탕으로 '${topic}'의 핵심 개념을 정리한 개념 노트를 작성하세요.\n- 핵심 개념 정의 및 계보\n- 주요 사상가 및 논점\n- 관련 개념들과의 관계도 (텍스트로 표현)\n- 실제 사례나 적용`,
        };

        // ⑤ AI API 호출
        const memoContents = selectedFiles.map(
            item => `### 📎 메모: ${item.file.basename}\n${item.content}`
        ).join('\n\n---\n\n');

        const seedSection = (triggerMode === 'news' && seedContent)
            ? `\n\n---\n# 참고 원문 (뉴스/텍스트)\n${seedContent.slice(0, 1500)}`
            : '';

        const finalPrompt = `${formatPrompts[format]}\n\n---\n# 참고 메모 (${selectedFiles.length}개)\n\n${memoContents}${seedSection}`;

        new obsidian.Notice(`⏳ ${providerLabel}(${this.getCurrentModelName()})가 발전 중...`);

        let result = '';
        try {
            result = await this.callAPI(finalPrompt);
        } catch (e) {
            new obsidian.Notice('❌ ' + e.message);
            return;
        }

        // ⑥ 연관 메모 자동 발견
        const excludePaths = selectedFiles.map(f => f.file.path);
        const relatedMemos = await this.findRelatedMemos(result, excludePaths);

        // ⑦ 새 메모 생성
        const sourceLinks = selectedFiles.map(f => `[[${f.file.basename}]]`).join(', ');
        const relatedLinks = relatedMemos.map(r => `[[${r.file.basename}]]`).join(', ');

        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
        const dateFile = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
        const newFileName = `${topic}_${format}_${dateFile}`;

        const relatedSection = relatedMemos.length > 0
            ? `\n\n---\n## 🔗 볼트 내 연관 메모 (자동 탐지)\n${relatedMemos.map(r => `- [[${r.file.basename}]] (연관도: ${r.score}점)`).join('\n')}`
            : '';

        const newContent = `---
topic: ${topic}
type: ${format}
trigger: ${triggerMode}
provider: ${this.settings.provider}
model: ${this.settings[this.settings.provider + 'Model']}
created: ${dateStr}
sources: ${sourceLinks}
related: ${relatedLinks}
---

${result}
${relatedSection}

---
> 🔍 키워드: \`${topic}\`
> 📎 참고 메모: ${sourceLinks}
`;

        try {
            await this.app.vault.create(newFileName + '.md', newContent);
            new obsidian.Notice(`✅ "${newFileName}" 생성 완료!`);
            const newFile = this.app.vault.getAbstractFileByPath(newFileName + '.md');
            if (newFile) await this.app.workspace.getLeaf(false).openFile(newFile);
        } catch (e) {
            new obsidian.Notice('❌ 메모 생성 실패: ' + e.message);
        }
    }
}

module.exports = MemoSynthesisPlugin;
