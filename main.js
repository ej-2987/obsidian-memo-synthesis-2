'use strict';

var obsidian = require('obsidian');

// ──────────────────────────────────────────────
// CONSTANTS
// ──────────────────────────────────────────────

// ──────────────────────────────────────────────
// LEET 구조 패턴별 기출 참고 지문 (원문 발췌)
// ──────────────────────────────────────────────
const LEET_KICHUL_FOLDER = 'LEET기출';
const LEET_KICHUL_SUBFOLDER = 'LEET기출/스타일참고';

const LEET_PASSAGE_REFS = {
    '기술-공학형': {
        year: '2026', title: 'DMN/BPMN 의사결정 모델링',
        passage: `업무 프로세스를 시각적으로 표현하는 모델링 언어 표준인 BPMN을 제정한 표준화 단체에서, 의사결정을 명시적으로 모델링하는 표준인 DMN을 발표하였다. BPMN으로 전체 업무 처리 과정을 모델링하고, DMN으로는 의사결정과 관련한 사항을 모델링할 수 있다. BPMN으로 복잡한 의사결정을 관리하는 데 한계가 있어, 별도 표준인 DMN을 개발하였다. BPMN 모델의 비즈니스 규칙 태스크에서 DMN 모델의 의사결정 테이블을 호출하는 방식으로 두 표준이 연동되어 활용된다.

그런데 전략적 의사결정은 의사결정 규칙이 불명확하고, 다양한 분석이 요구되므로 모델링하여 자동화하기는 매우 어렵다. 예를 들어 조직의 성패를 결정할 신제품 개발이나 기업의 인수합병과 같이 불확실성이 크고 위험을 수반하는 의사결정에 DMN을 적용하는 것은 부적절하다. DMN은 은행의 대출 승인 결정이나 보험회사의 보상금 결정과 같이 정해진 절차와 규칙에 따라 수행되는 일상적인 운영 의사결정을 자동화하는 데 효과적이다.

기존에는 개발자가 의사결정과 관련한 로직을 프로그래밍 언어로 코딩하여 애플리케이션으로 구현하였다. 이 방식에서는 애플리케이션 코드에 의사결정 로직을 구성하는 여러 규칙이 혼재해 의사결정 로직의 가시성이 낮으며, 로직이 복잡할수록 구현의 난도가 높아진다. 또한 경영 환경이 변하면 의사결정 로직도 신속하게 변경해야 하지만, 개발자가 코드를 수정해야 하므로 즉각적인 반영이 어렵다. 이 문제는 DMN을 사용하면 그래픽 다이어그램과 테이블 형태로 의사결정을 명시적으로 모델링하여 해결할 수 있다.

DMN 모델링을 통해서는 의사결정 요구 다이어그램(DRD)과 의사결정 로직을 작성한다. DRD는 의사결정 모델링의 시작점으로 불리는데, 맨 하위에 타원형으로 표시된 입력 데이터와 그 상위에 사각형으로 표시된 의사결정 노드 간 연결선으로 의사결정의 전체 구조를 표현한다. 입력 데이터는 의사결정 노드의 입력으로 제공되며, 하위 의사결정 노드의 결과로 생성된 데이터는 상위 노드의 입력으로 전달된다.

의사결정 테이블의 상단에는 여러 규칙이 동시에 만족될 때 이를 어떻게 처리할지를 설정하기 위한 적중 정책을 표기한다. 오버랩을 허용하지 않고 동시에 하나의 규칙만 만족되도록 규칙을 관리하는 방식인 '유일' 정책이 기본값이다. 한 번에 여러 규칙이 적용 가능한 경우에는 처음으로 만족되는 규칙을 적용하는 '최초' 정책과 규칙의 우선순위 값에 따라 적용 규칙을 선정하는 방식인 '우선순위' 정책 등 상황에 따라 적절한 적중 정책을 지정한다.`
    },
    '이론-비판-재반박형': {
        year: '2025', title: '공리주의와 권리',
        passage: `공리주의에서 도덕적으로 옳은 것은 공리를 극대화하는 결과를 산출하는 것이다. 반인권적인 행위나 제도라도 결과적으로 더 많은 공리를 산출한다면, 공리주의는 그것을 지지해야 한다. 가령 병원에 건강 검진을 받으러 온 한 사람을 죽여 다섯 명의 환자에게 장기를 이식하는 경우, 더 많은 공리는 산출되겠지만 한 명의 생명이 갖는 권리를 침해하게 된다. 도덕적 권리들이 존재하는 것이 틀림없다고 전제하는 피시킨은 이 권리들을 인정하지 않는 윤리 이론은 거부되어야 한다고 주장한다.

공리주의는 '권리의 규범적 힘'을 인정할 수 없기에 권리를 수용하기 어렵다고 라이언스는 비판한다. 그에 따르면 내가 어떤 것을 할 권리를 가진다는 사실은 타인의 간섭에 반대하는 근거를 제공할 뿐만 아니라, 권리 침해를 옹호하는 논변이 넘어야 하는 '논증의 문턱'을 제공한다. 그런데 공리주의는 행위의 도덕적 평가에서 일관되게 공리의 극대화를 기준으로 삼기 때문에, 권리의 규범적 힘을 인정할 수 없다.

한편, 반공리주의 논변에 맞서 브란트는 공리주의와 권리 사이의 부정합성은 단지 행위 공리주의에만 있을 뿐, 규칙 공리주의에는 없다고 주장한다. 개별 행위의 공리를 계산하는 행위 공리주의와 달리, 규칙 공리주의는 한 사회의 도덕률은 그것을 채택하지 않았을 때보다 채택했을 때 더 큰 공리를 산출하는 경우에만 옳으며, 어떤 개별 행위는 그 도덕률에 의해 정당화될 때 도덕적으로 옳다고 본다.

헤어는 공리주의와 권리의 도덕적 힘 사이의 부정합성은 '직관적 수준'과 '비판적 수준'으로 이루어진 자신의 두 수준 공리주의 이론을 따를 때 해소된다고 주장한다. 직관적 수준의 사유란 우리가 이미 주어진 것으로 간주하고 의문을 제기하지 않는 마음의 습관이나 원리 등을 개별적 사안에 적용할 때의 사유로서, 규칙 공리주의적으로 사유하는 것을 가리킨다.`
    },
    '분류-비교형': {
        year: '2025', title: '배아보호법 — 독일과 한국의 비교',
        passage: `보조생식술의 발전에 따라 난임 부부도 자기 생식세포를 이용한 체외수정으로 배아를 생성한 뒤 이를 모체에 이식하여 임신할 수 있게 되었다. 이 발전은 시술 뒤에 남은 배아를 어떻게 처리할 것인지에 대한 윤리적 논란도 유발하였다. 잔여 배아를 예외 없이 폐기해야 한다는 견해와, 난치병 연구를 위해 사용할 수 있게 해야 한다는 견해가 맞서고 있는 것이다.

이와 관련하여 독일에서는 배아보호법을 제정하였다. 이 법은 대다수 국가의 법령들처럼 임신을 목적으로 하지 않는 배아의 생성을 애초에 불허하고 있지만, 다른 나라의 입법례와는 달리 가급적 잔여 배아 자체가 만들어지지 않게 하는 것이 최선이라는 시각을 반영한 엄격한 기준을 규정하여 배아 생성자의 자기결정권을 제한한다. 이에 따르면 1회의 시술 주기 내에 난자를 3개까지만 수정시킬 수 있고, 같은 시술 주기 내에 배아를 3개까지만 이식할 수 있다.

그런데 이 법을 따르면 선택적 단일 배아 이식의 방식을 취하기가 어렵게 된다. 하나를 제외한 나머지 배아에 모두 결함이 있어 불가피하게 배제될 경우가 아니라면, 충분히 건강한 한두 개의 배아를 다음 시술 시기를 위해 남겨 두지 못하기 때문이다. 그 결과 모든 배아를 일단 착상시킨 후 가장 건강한 하나만을 남기고 나머지 한두 개는 모체에서 제거하는 일이 종종 일어난다.

한국 법에서도 출산을 목적으로 할 때만 생식세포를 제공하여 배아를 생성할 수 있다. 일단 배아가 생성되면, 이식 횟수의 결정, 배아의 보존 여부, 난치병 연구를 위한 사용 여부 등에 대해 배아 생성자에게 의사 결정을 맡긴다. 다만 배아의 보존 기간은 5년 이내로만 정할 수 있고, 이 기간이 지나면 잔여 배아는 배아 생성자의 의사와 무관하게 원칙적으로 폐기해야 한다.`
    },
    '분석틀-적용형': {
        year: '2025', title: '사법심사와 여론 — 네 가지 모델',
        passage: `사법심사는 다수주의의 예외로 간주되기도 한다. 민주적 절차로 선출된 의회나 행정부의 결정이 합헌 여부를 기준으로 무효화될 수 있기 때문이다. 반대로 사법심사의 결과가 여론에 영향을 미치는 방향도 상정할 수 있다. 미국 정치를 배경으로 한 기존 연구는 이 상황을 크게 네 가지 모델로 구분해 설명한다.

우선 '긍정적 반응 모델'이다. 이 모델은 어떤 사안에 대해 반대 의견을 가졌던 사람들도 연방대법원의 결정이 나온 후에는 기존 의견을 수정해 그 결정을 수용하는 경우가 많다는 현상에 주목한다. 이때 찬반 의견의 변경은 그 사안에 대해 대중의 관여도가 비교적 낮아 발생한 것으로 설명된다.

'반발 모델'은 사법심사 결과에 불복하는 그룹들이 반대 의사를 적극 표출하고 이것이 전체 여론으로 확산하는 현상에 주목한다. 연방대법원이 동성혼을 합헌으로 결정하자 동성혼에 대한 지지는 물론 성적 소수자를 포용하는 여론이 도리어 감소했음을 밝혀낸 연구가 그 사례이다. 한편, 사법심사 결과에 대한 반발은 시간 경과에 따라 줄어드는 경우가 있어 이 모델은 내구성이 약하다고 평가되기도 한다.

'양극화 모델'은 여론의 주목을 받지 못하던 사안들이 사법심사를 계기로 본격적인 쟁점으로 전환되어 대중의 찬반 여론이 극명하게 갈리는 현상에 주목한다. 마지막으로 '무반응 모델'은 사법심사 결정 후에도 기존의 여론 지형도가 지속되는 무반응 현상에 주목한다. 사법심사가 의회의 결정을 지지하는 경우, 언론의 주목도나 여론의 관심도는 대체로 낮다.`
    },
    '논쟁-통합형': {
        year: '2026', title: '인식적 수의주의와 불수의주의',
        passage: `해가 서쪽에서 뜬다고 믿고 싶다고 맘대로 그렇게 믿을 수 있을까? 그렇게 상상하거나 또는 그렇게 믿는 듯이 행동하는 것은 원하기만 하면 할 수 있다. 하지만 무엇을 믿는다는 것은 그것이 참이라고 믿는 것인데, 원한다고 해서 "해는 서쪽에서 뜬다."라는 명제가 참이라고 실제로 믿을 수 있을까? 최소한 어떤 믿음은 인간이 수의적으로 즉, 자기 뜻대로 즉각적으로 믿을 수 있다는 입장을 인식적 수의주의라 하고 그런 믿음은 없다는 입장을 인식적 불수의주의라 한다.

올스턴은 인간 심리에 근거해 수의주의에 반대한다. 그는 "해는 서쪽에서 뜬다."처럼 거짓임이 분명한 명제의 경우에는 누구도 수의적으로 믿을 수 없다는 것이 명백한 경험적 사실이라고 주장한다. 그리고 명제 p를 지지하는 증거와 반대하는 증거가 증거력이 비슷해서 참 거짓 여부가 분명하지 않은 경우에도 올스턴은 p를 수의적으로 믿을 수 없다고 주장한다.

믿음의 개념 분석에 기반한 불수의주의도 있다. 윌리엄스에 따르면, 명제 p를 수의적으로 믿는다는 것은 p가 참인지와 무관하게 p를 믿을 능력을 필요로 한다. 그런데 우리는 스스로가 지닌 어떤 믿음에 대해서도 그것이 참거짓 여부와 무관하게 형성된 것이라고 생각할 수 없다. 믿음의 개념상 p를 믿는다는 것은 곧 p가 참이라고 믿는 것이기 때문이다.

히로니미 역시 '수의성'과 '믿음'의 정의에 기반해 수의주의에 반대한다. 그의 정의에 따르면, 어떤 행위가 수의적이라는 것은 그것이 실천적인 이유에 따라 즉각 행해질 수 있다는 것이며, p라고 믿는다는 것은 "p가 참인가?"라는 의문을 해결함으로써 갖게 되는 태도라는 의미에서 참을 목표로 하는 태도이다.`
    },
    '역사-인과형': {
        year: '2026', title: '현량과와 기묘사화',
        passage: `1518년 6월 중종은 "내가 정사를 돌보면서부터 태평한 통치를 바라여 널리 인재를 구한 지 열 해 남짓이나 효과 없이 한탄만 할 뿐이니, 많은 현능한 이들이 추천되어 어진 교화를 도울 수 있도록 할 방법을 의논하라." 하고 명하였다. 조선은 시험으로 재목을 선발하여 관리로 등용하는 과거제도를 고려로부터 이어받아 운영하고 있었다. 유학적 소양을 선발 기준으로 하는 과거는 성리학을 표방한 국가에 매우 적합한 제도였다.

하지만 시험만을 위한 경전 암기와 모범 답안 위주의 학습이 진정한 학문은 아니라는 비판이 일었다. 조광조가 주도하는 사림 세력은 기존의 과거가 글재주만 시험할 뿐 관료로서의 재능이나 인품, 행실 등은 보지 못한다고 하면서, 진정한 교화를 실현하기 위한 보완으로서 과거제도에 천거제인 현량과를 도입하기를 청하였다. 덧붙여 현행 제도는 권세가의 자녀가 합격하기에 유리하여 초야에 숨은 인재들을 발굴하는 데 한계가 있다는 지적도 하였다.

이런 천거제에 대하여 훈구 세력의 반발은 컸다. 시험 없이 쉽게 관리가 되는 것은 공정성의 원칙을 무너뜨리는 것이고, 추천으로 선발하는 것이 오히려 부당한 특혜로 작용한다는 비판을 제기하였다.

우여곡절 끝에 1519년 현량과가 시행되었다. 장원은 조광조와 친분이 두터운 김식이었고, 사림파의 후원자로 알려진 안당은 세 아들이 모두 합격하였다. 자파 세력 키우기라는 정적들의 비난은 피할 수 없었다. 현량과는 결국 기묘사화의 주요한 계기와 명분으로도 작용하였고, 사화 직후 현량과의 문과 합격은 취소되었다.`
    },
    '개념-확장형': {
        year: '2026', title: '지구법학과 지구권',
        passage: `법학 전통에서 대체로 자연은 인간에게 유용한 것들의 총체이자 집단 혹은 개인의 자산으로 간주된다. 소유 대상으로서의 자연은 그것을 둘러싼 인간 상호 간의 권리의무관계를 위해 존재한다. 생태사상가 베리는 인간이 세계 전체 혹은 타자와 맺는 관계 양식이 인간중심의 법규범에 반영되어온 동시에 그러한 법규범에 의해 강화되어 왔음을 지적한다. 법적 인격만을 권리와 의무의 주체로 보고 인격 아닌 모든 존재자는 행위의 객체인 물건으로 보는 법은 자연의 가치를 인간의 손익과 관련지어 평가할 뿐 존중하진 않았다.

베리가 주창한 지구법학은 생태계를 구성하는 모든 존재의 권리를 지구권으로 정립하려 한 급진적인 법사상이다. 더 나아가 지구법학은 우주의 질서 안에 무언가가 존재한다는 사실 자체에서 그것이 권리를 가진다는 규범적 결론을 끌어낸다. 이에 따르면 물리적으로 지속되는 실체를 갖거나 일정한 지리적 영역을 점하는 존재자인 무생물의 권리도 인정된다.

지구권은 존재할 권리, 서식지에 관한 권리, 지구공동체가 부단히 새로워지는 과정에서 자기 역할과 기능을 수행할 권리 등으로 구체화된다. 강은 강의 권리를, 새는 새의 권리를, 인간은 인간의 권리를 가지며, 각 권리의 존재 양태는 저마다 다르다.

이러한 권리 개념을 수용하여 구체적인 법의 근거로 채택한 사례도 없진 않다. 에콰도르는 '생명의 순환과 진화 과정을 유지하고 재생을 존중받을 권리'와 '자연이 스스로를 원상회복할 권리'를 헌법에 규정한다. 한편 뉴질랜드는 전체로서의 자연의 권리를 보호하는 방식 대신 특정 생태계나 종의 권리를 개별적으로 보호하는 방식을 택한다.`
    },
    '현상-해석형': {
        year: '2026', title: '민주주의 퇴행의 두 모델',
        passage: `선출된 정치인이 합법적으로 민주적 가치를 잠식하는 민주주의 퇴행도 급격하고 폭력적인 방식의 쿠데타 못지않게 심각한 민주주의의 위기이다. 집권자는 '조작'을 감행할 능력을 갖추고 있다. 여기서 조작이란 명백한 위법행위가 아니라, 선거권이나 피선거권 규정의 개정이나 미디어 규제를 통한 여론 개입, 국가기구에 대한 당파적 영향력 증대 등과 같이 불법성이 명확하지 않지만 정치 과정을 불공정하게 만들어 집권 가능성을 높이려는 행위들을 일컫는다.

스볼릭 모델에서 유권자는 후보자의 정책이념과 자신의 정책이념 사이의 거리와 반비례하는 효용의 크기에 따라 지지 후보를 선택하는데, 후보자 가운데 집권자를 판단할 때는 그가 행한 조작의 정도에 비례하여 생기는 효용의 감소를 계산에 넣는다. 예를 들어, 어떤 나라에서 우파 집권자가 조작을 행한 경우, 온건 우파 유권자는 민주주의 훼손에서 생기는 효용의 감소가 좌파 도전자의 집권으로 생기는 이념 관련 효용의 감소보다 커서 집권자를 지지하지 않을 가능성이 크다.

한편, 루오와 쉐보르스키 모델에서 유권자들은 후보자의 정책이나 능력 등을 보고 주관적으로 평가한 '매력'에 기초해서 투표한다. 집권자의 매력이 높아서 시민들이 집권자에 매우 만족하고 도전자가 더 매력적일 가능성이 작을 때, 집권자는 조작에 거리낌을 갖지 않는데 이를 '지지 속의 퇴행'이라 한다. 반면 집권자의 매력이 낮은 경우에는 집권자가 운 좋게 몇 차례 선거에 승리해서 집권자 프리미엄이 일정 수준을 넘어서면 집권의 장기화를 우려하는 시민들은 설사 당면 선거에서 도전자의 매력이 더 낮더라도 정권교체를 원하게 된다.`
    },
};

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
        containerEl.createEl('h2', { text: 'Memo Synthesis Settings' });

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
            name: 'Run Memo Synthesis',
            callback: () => this.runSynthesis(),
        });

        this.addCommand({
            id: 'run-memo-synthesis-switch-api',
            name: 'Run Memo Synthesis (select API)',
            callback: () => this.runSynthesisWithApiSelect(),
        });

        this.addRibbonIcon('brain', 'Memo Synthesis', () => this.runSynthesis());

        // LEET 기출 참고 파일 자동 생성 (최초 설치 시)
        this.ensureLeetKichulFolder();
    }

    async ensureLeetKichulFolder() {
        const folderPath = LEET_KICHUL_SUBFOLDER;
        const adapter = this.app.vault.adapter;

        // 폴더가 없으면 생성
        const parentExists = await adapter.exists(LEET_KICHUL_FOLDER);
        if (!parentExists) {
            await this.app.vault.createFolder(LEET_KICHUL_FOLDER);
        }
        const subExists = await adapter.exists(folderPath);
        if (!subExists) {
            await this.app.vault.createFolder(folderPath);
        }

        // 각 구조 패턴별 참고 파일 생성
        for (const [pattern, data] of Object.entries(LEET_PASSAGE_REFS)) {
            const filePath = `${folderPath}/${pattern}.md`;
            const fileExists = await adapter.exists(filePath);
            if (!fileExists) {
                const content = `---
구조패턴: ${pattern}
출처: ${data.year}년 LEET 언어이해
제목: ${data.title}
---

# ${data.title} (${data.year}년 LEET)

> [!info] 구조 패턴: **${pattern}**
> 아래 지문은 이 구조 패턴의 실제 기출 예시입니다. AI 지문 생성 시 참고 스타일로 활용됩니다.

${data.passage}
`;
                await this.app.vault.create(filePath, content);
            }
        }
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
                max_tokens: 8192,
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
                max_tokens: compact ? 100 : 8192,
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

        // ── LEET 전용 2단계 생성 ────────────────────────────────────
        if (format === 'leet') {
            const topicType = await this.suggest(
                ['🔬 과학/기술', '🧠 철학', '⚖️ 법학', '💰 경제', '👥 사회학', '📚 역사', '🎨 예술', '🎲 자동'],
                ['과학/기술', '철학', '법학', '경제', '사회학', '역사', '예술', '자동'],
                '🎯 주제 유형 선택'
            );
            if (!topicType) { new obsidian.Notice('취소되었습니다.'); return; }

            const structType = await this.suggest(
                ['1️⃣ 기술-공학형', '2️⃣ 이론-비판-재반박형', '3️⃣ 분류-비교형',
                 '4️⃣ 분석틀-적용형', '5️⃣ 논쟁-통합형', '6️⃣ 역사-인과형',
                 '7️⃣ 개념-확장형', '8️⃣ 현상-해석형', '🎲 자동'],
                ['기술-공학형', '이론-비판-재반박형', '분류-비교형', '분석틀-적용형',
                 '논쟁-통합형', '역사-인과형', '개념-확장형', '현상-해석형', '자동'],
                '📐 구조 패턴 선택'
            );
            if (!structType) { new obsidian.Notice('취소되었습니다.'); return; }

            const memoContentsRaw = selectedFiles.map(
                item => `### ${item.file.basename}\n${item.content}`
            ).join('\n\n').replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, '$1').replace(/!\[.*?\]\(.*?\)/g, '').trim().substring(0, 2500);

            const sourceNames = selectedFiles.map(f => f.file.basename);
            const sourceTitleLabel = sourceNames.length === 1 ? sourceNames[0] : `${sourceNames[0]} 외 ${sourceNames.length - 1}개`;

            // 1차 API: 지문 생성
            new obsidian.Notice('📝 [1/2] 지문 생성 중...', 5000);

            // ── 주제 유형별 어휘/논증 스타일 ──────────────────────────
            const topicStyleMap = {
                '과학/기술': `[주제 유형: 과학/기술]
• 시스템·메커니즘 중심 서술 — 수식·도표 없이 텍스트만으로 관계를 기술한다
• 개념 도입 패턴: "~라 불리는", "~로 정의되는" 이후 그 명칭만으로 반복 지칭
• 인과·기능 연결어 사용: "~에 비례하여", "~의 결과로 ~이 증가한다", "~의 기질이 되어 ~으로 전환된다"
• 단계 기술 패턴: "먼저 A가 B로 전환되고, 이 B는 C의 입력으로 제공되어 D를 산출한다"
• 대비 패턴: "반면 ~는 ~에 위치하여", "이와 달리 ~의 경우에는"
• 한계·예외 처리: "다만 ~가 높아질수록 ~는 작아진다", "단, ~인 경우에만 적용된다"`,

                '철학': `[주제 유형: 철학]
• 논리적 귀결 중심: "~라면 ~이 도출된다", "~를 전제한다면 ~가 함의된다"
• 반례·직관 호소: "~처럼 거짓임이 분명한 경우", "~를 상상해 보자", "우리는 ~라고 직관적으로 안다"
• 개념 구분 패턴: "~의 개념상 ~라는 것은 곧 ~이다", "~와 구별되는 ~는"
• 입장 귀속 표현: "~에 따르면", "~의 논변에 의하면", "~는 이를 근거로 주장한다"
• 조건절 중첩: "~하지 않는 한 ~이 가능하지 않으므로, ~인 경우에만 ~라고 볼 수 있다"
• 역설적 귀결 제시: "그렇다면 ~도 ~어야 한다는 결론이 따라오는데, 이는 ~을 위협한다"`,

                '법학': `[주제 유형: 법학]
• 규범적 판단과 기술적 서술 혼재: 법의 내용을 기술할 때와 그 평가를 구분해 서술
• 법 문언 스타일: "~를 명시한다", "~에 의하면 ~는 ~할 수 있다", "~로 규정한다"
• 권리·의무·책임 관계 중심: "~의 주체", "~를 집행할", "~에 대한 의무를 부과한다"
• 제도 비교 패턴: "A는 ~인데 반해 B는 ~", "A와 달리 B는 ~에 한해 허용한다"
• 법리 구성 패턴: "~으로부터 ~를 도출한다", "~라는 논거로써 ~를 옹호한다"
• 역설·딜레마 제시: "~를 금지한 결과 오히려 ~가 초래되는 역설적 상황이 발생한다"`,

                '경제': `[주제 유형: 경제]
• 변수-함수 관계 명시: "~의 증가는 ~를 초래한다", "~와 반비례하는 ~의 크기에 따라"
• 모형 기반 서술: "~모형에서 ~는 ~의 함수이며", "~에 따르면 ~의 변동은 다음과 같이 표현된다"
• 균형·최적화 개념: "~가 일치하여 ~의 변화가 없는 상태", "~를 극대화하는 수준에서"
• 시간적 동태 서술: "시간이 지남에 따라 ~가 수렴하게 된다", "~가 늘어남에 따라 ~의 속도가 감소한다"
• 트레이드오프 제시: "~로부터 얻는 효용과 ~로부터 얻는 효용 사이의 트레이드오프에 직면한다"
• 인과 역전 주의: "~가 성장의 원인이기도 하지만 ~가 ~를 개선하는 거꾸로 된 인과관계도 존재한다"`,

                '사회학': `[주제 유형: 사회학]
• 집단·구조·행위자 관계: "~집단은", "~세력은", "~층에서 더 강하게 나타난다"
• 경향성 표현: "~하는 경향이 있다", "~할 가능성이 크다", "~와 상관관계가 있다"
• 제도와 행위자의 상호작용: "~에 반응하는", "~에 민감하게", "~를 고려하여 선택하는"
• 통계·수치 서술: "~% 포인트 감소했다", "~보다 ~배 높다", "~과 X% 이상 일치한다"
• 역설적 패턴: "~이 ~을 억제한 결과 오히려 ~가 확산되었다"
• 구조와 행위의 공모: "~가 ~를 강화하는 동시에 ~에 의해 강화되어 왔다"`,

                '역사': `[주제 유형: 역사]
• 시간·맥락 제시: "~세기 ~에서", "~이후", "~를 계기로", "~를 이어받아 운영하고 있었다"
• 역사적 행위자의 동기·선택: "~를 주도한 ~는", "~하고자 한 ~는 ~를 청하였다"
• 인과의 복잡성 강조: "~의 결과로", "~를 계기로 ~가 촉발되었다", "~에 빌미가 되기도 했다"
• 역설적 귀결: "그러나 ~는 예상과 달리", "아이러니하게도 ~는 ~의 계기가 되었다"
• 입장 대립 구도: "~는 ~라 하면서 ~를 반박했다", "~에 동조하면서도 ~와는 달리"
• 제도의 지속과 변화: "~는 결국 ~로 폐지되었다", "~는 이후에도 ~까지 유지되다가"`,

                '예술': `[주제 유형: 예술]
• 작품·작가·수용자 삼각 구도 서술
• 사회적 맥락과 예술 형식의 교차: "~를 소재로 ~라는 미적 전략을 취한다", "~의 형식을 빌어"
• 효과와 의도의 분리: "작가의 의도와 달리", "독자에 의해 새롭게 읽히기 마련이다"
• 장르 관습과 전복: "~라는 통상적인 문법을 따랐지만", "~의 장르적 관습을 전도시키는 데까지 나아갔다"
• 대항 담론 기능: "~에 대한 대항 담론을 선전·유포하여 ~의 원동력이 되기도 했다"
• 수용 맥락의 변화: "~으로 수용층이 넓어지자", "시간과 공간을 달리해 새롭게 읽히면서"`,

                '자동': `[주제 유형: 자동 판단]
• 노트 내용의 성격과 소재에 가장 적합한 주제 유형을 스스로 판단하여 적용하라`,
            };

            // ── 구조 패턴별 문단 청사진 ──────────────────────────────
            const structBlueprintMap = {
                '기술-공학형': `[구조 패턴: 기술-공학형]
기출 대응 지문: DMN/BPMN 의사결정 모델링, 포르피린증, 솔로우 성장모형, k-익명성/비식별화 기술, 단백질 신호서열 이론

문단 청사진:
• 1단락(300~400자): 기존 방식의 한계 혹은 문제 상황 → 새 시스템·기술·이론의 등장 배경 제시
  - 패턴: "기존에는 ~하는 방식이었다. 이 방식에서는 ~라는 한계가 있어, ~를 사용하면 해결할 수 있다"
• 2단락(600~700자): 핵심 시스템의 구성 요소 명칭 도입 + 각 요소의 기능·관계 기술
  - 패턴: "~라 불리는 A는 B의 입력으로 제공되며, C와 달리 D는 ~의 경우에만 해당 조건을 참으로 간주한다"
• 3단락(600~700자): 작동의 세부 메커니즘·수치적 규칙을 도표·수식 없이 텍스트만으로 기술
  - 패턴: "~는 자본량과 ~률의 곱으로 결정된다. 자본량이 늘어나면 ~가 늘어나고 ~도 늘어나지만, ~의 증가 속도는 차츰 감소하는데 이는 ~때문이다"
• 4단락(500~600자): 시스템 내 정책·규칙·예외의 처리 방식, 서로 다른 조건에서의 작동 차이
  - 패턴: "~를 허용하지 않는 '유일' 정책이 기본값이다. ~한 경우에는 ~정책과 ~정책을 상황에 따라 지정한다"
• 5단락(400~500자): 시스템의 한계 또는 이 기술이 적용될 수 없는 조건
  - 패턴: "그러나 ~의 경우에는 ~이 매우 어렵다. 예를 들어 ~와 같이 ~인 의사결정에는 적용이 부적절하다"`,

                '이론-비판-재반박형': `[구조 패턴: 이론-비판-재반박형]
기출 대응 지문: 공리주의와 권리(피시킨·라이언스·브란트·헤어), 알베르트 vs 사비니의 법학론 논쟁

문단 청사진:
• 1단락(300~400자): 지배적 이론의 핵심 주장 소개 + 그 이론이 야기하는 긴장·역설 예시로 제시
  - 패턴: "~에서 도덕적으로 옳은 것은 ~이다. 가령 ~를 죽여 ~하는 경우, ~이겠지만 ~를 침해하게 된다"
• 2단락(600~700자): 첫 번째 비판자의 논거 전개 (심리적·경험적 근거)
  - 패턴: "A는 ~에 근거해 지배 이론에 반대한다. 그는 ~의 경우에는 ~할 수 없다는 것이 명백한 경험적 사실이라고 주장한다"
• 3단락(600~700자): 두 번째 비판자의 논거 전개 (개념 분석적·원리적 근거)
  - 패턴: "B 역시 ~의 정의에 기반해 반대한다. ~에 따르면 ~라는 것은 ~임을 필요로 한다. 그런데 ~이므로 ~는 불가능하다"
• 4단락(500~600자): 지배 이론 측의 수정 시도 또는 재반박 (새로운 구분 도입)
  - 패턴: "이에 맞서 C는 ~에는 없을 뿐, ~에는 없다고 주장한다. ~는 ~의 경우에만 옳으며, 어떤 개별 행위는 그 ~에 의해 정당화될 때 도덕적으로 옳다"
• 5단락(400~500자): 수정 시도의 한계와 논쟁이 남기는 근본 문제
  - 패턴: "라이언스는 C도 ~를 수용하지 못한다고 주장한다. ~에서는 ~이 가능하기에 ~는 ~의 이유를 제공할 수는 있어도 ~해야 할 이유는 제시하지 못한다"`,

                '분류-비교형': `[구조 패턴: 분류-비교형]
기출 대응 지문: 배아보호법(독일 vs 한국), 소년애(고대 그리스 vs 로마), 미국 역사학파 비교

문단 청사진:
• 1단락(300~400자): 비교 대상의 공통 배경·문제의식 제시 + 비교 필요성 환기
  - 패턴: "~의 발전에 따라 ~도 ~할 수 있게 되었다. 이는 ~를 어떻게 처리할 것인지에 대한 논란도 유발하였다"
• 2단락(600~700자): A 유형의 핵심 원리 + 구체적 제도·관행의 전개 (조건·규칙 포함)
  - 패턴: "A에서는 ~라는 시각을 반영하여 엄격한 기준을 규정한다. 이에 따르면 ~수 이내로만 ~할 수 있고, ~해서는 안 된다"
• 3단락(600~700자): B 유형의 핵심 원리 + 구체적 제도·관행 (A와 명시적 대비)
  - 패턴: "반면 B는 ~하는 방식 대신 ~하는 방식을 택한다. ~를 법적 ~로 규정하고, 그 권리는 ~가 ~의 이름으로 대리하여 집행할 것을 명시한다"
• 4단락(500~600자): 각 유형의 내적 역설·모순 또는 의도와 결과의 괴리
  - 패턴: "그런데 이 법으로 인해 오히려 ~가 초래되는 역설적 상황이 발생한다. 이는 ~의 특수성에서 비롯된다"
• 5단락(400~500자): 두 유형의 비교를 통해 드러나는 상위 원리 또는 해결 과제
  - 패턴: "결국 A와 B의 차이는 ~를 어디에서 찾느냐의 차이로 수렴된다. ~가 가능하게 하고 ~가 결정하도록 하자는 제안이 이러한 맥락에서 등장한다"`,

                '분석틀-적용형': `[구조 패턴: 분석틀-적용형]
기출 대응 지문: 사법심사와 여론(4가지 모델), 도구변수/번영의 역전, 투표 참여와 날씨(비용 모델)

문단 청사진:
• 1단락(300~400자): 분석이 필요한 현상·역설 제시 + 기존 설명의 한계
  - 패턴: "X와 Y 사이에 높은 상관관계가 있음을 확인하는 것만으로는 X가 Y의 원인이라는 주장을 지지하기 어렵다. ~도 존재하기 때문이다"
• 2단락(600~700자): 첫 번째·두 번째 분석 항목의 정의·조건·적용 범위
  - 패턴: "우선 '~모델'이다. 이 모델은 ~하는 현상에 주목한다. 이때 ~는 ~가 낮아 발생한 것으로 설명된다"
• 3단락(600~700자): 세 번째·네 번째 분석 항목의 정의·조건·적용 범위 (앞 항목과 비교)
  - 패턴: "'~모델'은 ~결과에 불복하는 그룹이 ~의사를 표출하고 이것이 전체 여론으로 확산하는 현상에 주목한다"
• 4단락(500~600자): 항목 간 전환 조건 및 겹치는 경우의 처리
  - 패턴: "~하는 경우 ~모델의 설득력이 커진다. 한편 ~모델은 내구성이 약하다고 평가되기도 하는데, ~이기 때문이다"
• 5단락(400~500자): 분석틀의 설명 한계와 보완 방향
  - 패턴: "이러한 분석틀은 ~한 사례를 잘 설명할 수 있다고 평가된다. 그러나 ~의 경우에는 여전히 설명하기 어렵다"`,

                '논쟁-통합형': `[구조 패턴: 논쟁-통합형]
기출 대응 지문: 인식적 수의주의 vs 불수의주의(올스턴·윌리엄스·히로니미), 판사의 진솔함

문단 청사진:
• 1단락(300~400자): 논쟁의 핵심 질문 제시 + 두 입장을 학술 용어로 정의
  - 패턴: "~이 옳으냐는 질문은 ~와 연관된다. 최소한 어떤 ~은 ~할 수 있다는 입장을 A라 하고, 그런 ~은 없다는 입장을 B라 한다"
• 2단락(600~700자): A 입장의 다양한 논거 전개 (실질적·경험적 근거)
  - 패턴: "A에 반대하는 다양한 논변이 있다. X는 ~에 근거해 반대한다. 그는 ~의 경우에는 ~이 명백한 경험적 사실이라고 주장한다"
• 3단락(600~700자): B 입장의 다른 논거 전개 (개념적·원리적 근거, A와 차별화)
  - 패턴: "Y 역시 ~의 정의에 기반해 반대한다. ~에 따르면 ~라는 것은 ~을 필요로 한다. 그런데 ~이므로 ~는 불가능하다"
• 4단락(500~600자): 두 입장이 공유하는 전제 또는 논쟁이 드러내는 더 깊은 층위
  - 패턴: "이처럼 ~와 ~의 차이에도 불구하고, 두 입장은 모두 ~가 ~이어야 한다는 전제를 공유한다"
• 5단락(400~500자): 논쟁이 실천적으로 함축하는 의미와 남는 과제
  - 패턴: "진솔함의 중요성은 최근에는 다른 차원에서 제기되고 있다. ~는 ~를 수호하는 중요한 방책이 된다"`,

                '역사-인과형': `[구조 패턴: 역사-인과형]
기출 대응 지문: 조선의 현량과, 미국 혁신주의·합의사학·신좌파 역사학, 뉴게이트 소설의 역사적 전개

문단 청사진:
• 1단락(300~400자): 역사적 배경·문제 상황 + 기존 제도·관행의 맥락 소개
  - 패턴: "~년 ~는 '~'라 명하였다. ~는 ~를 ~로부터 이어받아 운영하고 있었다. 이는 ~에 적합한 제도였다"
• 2단락(600~700자): 기존 제도에 대한 비판과 변화의 논거 (비판 세력의 주장)
  - 패턴: "하지만 ~는 ~한 비판이 일었다. ~는 기존의 ~가 ~만을 할 뿐 ~는 보지 못한다고 하면서, ~를 보완으로서 도입하기를 청하였다"
• 3단락(600~700자): 변화 시도의 구체적 내용 + 저항 세력의 반발 논거
  - 패턴: "~에 대하여 ~의 반발은 컸다. ~하는 것은 ~의 원칙을 무너뜨리는 것이고, ~로 선발하는 것이 오히려 ~로 작용한다는 비판을 제기하였다"
• 4단락(500~600자): 변화의 실제 전개 + 의도치 않은 결과(역설)
  - 패턴: "우여곡절 끝에 ~가 시행되었다. 다수가 ~였다. ~라는 비난은 피할 수 없었다. 그리하여 ~도 ~를 하게 되었다"
• 5단락(400~500자): 역사적 결과와 그 복잡한 인과적 의미
  - 패턴: "~는 결국 ~의 주요한 계기와 명분으로도 작용하였고, ~ 직후 ~는 취소되었다. 이후 ~는 다시 ~되지 않았으며 ~ 자체는 ~까지 유지되다가 ~로 폐지되었다"`,

                '개념-확장형': `[구조 패턴: 개념-확장형]
기출 대응 지문: 지구법학(베리·컬리넌), 도덕 공동체의 경계 확장(싱어·커루더스)

문단 청사진:
• 1단락(300~400자): 지배적 개념의 전제와 그것이 배제하는 것 — 기존 경계의 한계 지적
  - 패턴: "~전통에서 대체로 ~은 ~로 간주된다. ~만을 ~의 주체로 보고 ~은 행위의 객체로 보는 ~은 ~의 가치를 ~와 관련지어 평가할 뿐 ~하지는 않았다"
• 2단락(600~700자): 새 개념의 등장 + 핵심 전제 전환의 논거 + 이전 단계적 확장 사례
  - 패턴: "~가 주창한 ~는 ~의 권리를 ~으로 정립하려 한 급진적인 ~이다. 더 나아가 ~는 ~라는 사실 자체에서 ~가 권리를 가진다는 규범적 결론을 끌어낸다"
• 3단락(600~700자): 새 개념의 파생 항목들 + 내적 논리의 전개 + 함의되는 의무
  - 패턴: "~권은 존재할 권리, ~에 관한 권리, ~를 수행할 권리 등으로 구체화된다. ~은 ~의 권리를, ~는 ~의 권리를 가지며, 각 권리의 존재 양태는 저마다 다르다"
• 4단락(500~600자): 새 개념의 제도적 수용 사례 + 유형별 차이
  - 패턴: "이러한 권리 개념을 수용하여 구체적인 법의 근거로 채택한 사례도 없진 않다. A는 ~를 규정하고, B는 이와 달리 ~하는 방식을 택한다"
• 5단락(400~500자): 개념이 도달한 한계 또는 남은 긴장
  - 패턴: "흐르던 ~이 가로막힌 ~의 권리는 사회적 관심을 환기하려는 ~의 기획을 넘어 구체적인 법리 구성 단계에서도 다루어지게 되었다"`,

                '현상-해석형': `[구조 패턴: 현상-해석형]
기출 대응 지문: 민주주의 퇴행 두 모델(스볼릭·루오&쉐보르스키), 뉴게이트 소설과 법 개혁

문단 청사진:
• 1단락(300~400자): 역설적·이해하기 어려운 현상 제시 + 분석의 필요성
  - 패턴: "선출된 ~가 합법적으로 ~를 잠식하는 ~도 급격하고 폭력적인 방식의 ~못지않게 심각한 ~의 위기이다. ~는 ~를 감행할 능력을 갖추고 있다"
• 2단락(600~700자): 첫 번째 해석 틀 — 행위자 선택·합리적 계산 중심
  - 패턴: "우선 ~모델에서 유권자는 ~와 반비례하는 효용의 크기에 따라 ~를 선택하는데, ~를 판단할 때는 ~에 비례하여 생기는 효용의 감소를 계산에 넣는다"
• 3단락(600~700자): 두 번째 해석 틀 — 구조·맥락·기대값 중심
  - 패턴: "한편 ~모델에서 유권자들은 ~에 기초해서 투표한다. 이처럼 ~가 아닌 경우라도, ~이므로 시민들은 ~에 가치를 부여한다는 것이다"
• 4단락(500~600자): 두 틀의 보완 관계 + 각각이 잘 설명하는 하위 유형 구분
  - 패턴: "~가 높아서 시민들이 ~에 매우 만족하고 ~일 때, ~는 ~에 거리낌을 갖지 않는데 이를 '~'이라 한다. 반면 ~가 낮은 경우에는 ~을 '~'이라 한다"
• 5단락(400~500자): 현상에 내재한 더 근본적인 아이러니 또는 열린 결말
  - 패턴: "두 가지 ~에서 모두 ~와 같은 수단에 의해 교체될 위험을 감수할 정도까지 ~는 ~로 치닫는다"`,

                '자동': `[구조 패턴: 자동 판단]
• 노트 내용의 논리 구조에 가장 적합한 구조 패턴을 스스로 선택하여 위 8가지 패턴 중 하나를 따르라`,
            };

            const topicStyle = topicStyleMap[topicType] || topicStyleMap['자동'];
            const structBlueprint = structBlueprintMap[structType] || structBlueprintMap['자동'];

            // 구조 패턴 우선 매칭: vault의 참고 파일에서 실제 기출 발췌문 읽기
            let kichulStyleExample = '';
            const effectiveStruct = (structType === '자동') ? null : structType;
            if (effectiveStruct) {
                const refFilePath = `${LEET_KICHUL_SUBFOLDER}/${effectiveStruct}.md`;
                try {
                    const refFile = this.app.vault.getAbstractFileByPath(refFilePath);
                    if (refFile && refFile instanceof obsidian.TFile) {
                        const refContent = await this.app.vault.read(refFile);
                        // frontmatter 및 헤더 제거 후 본문만 추출
                        const bodyMatch = refContent.match(/^---[\s\S]*?---\s*([\s\S]*)$/);
                        const body = bodyMatch ? bodyMatch[1].trim() : refContent.trim();
                        kichulStyleExample = `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n[스타일 참고 — 실제 LEET 기출 발췌: ${LEET_PASSAGE_REFS[effectiveStruct]?.title || effectiveStruct}]\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n아래는 같은 구조 패턴(${effectiveStruct})의 실제 기출 지문 발췌입니다.\n이 지문의 문장 호흡, 개념 도입 방식, 문단 전환 패턴을 정밀하게 모방하십시오.\n(단, 내용 자체를 복사하지 말고 소재 노트의 내용으로 치환)\n\n${body}\n`;
                    }
                } catch(e) { /* 파일 읽기 실패 시 무시 */ }
            }

            const passagePrompt =
`당신은 LEET 언어이해 지문 전문 작가입니다. 실제 LEET 기출 지문의 난이도와 문체를 정확히 재현해야 합니다.

아래 노트 내용을 소재로 지문을 작성하되, [주제 유형]과 [구조 패턴]의 규칙을 반드시 따르십시오.

소재: ${sourceTitleLabel}

${topicStyle}

${structBlueprint}
${kichulStyleExample}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[공통 문장·문체 규칙 — LEET 기출 분석 기반]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
① 총 2,500~3,000자 / 5문단 (각 문단 분량은 구조 패턴 청사진을 따름)
② 평균 문장 길이 90자 이상 — 짧은 단문을 나열하지 말 것
③ 조건절 3단계 이상 중첩 필수:
   예) "~이기 때문에 ~한 경우에는 ~이 불가능하므로, ~에 한해서만 ~이 인정된다"
④ 직접 정의 엄금 ("X는 Y다") → 관계·함의·계기로 도입:
   예) "X가 함의하는 바는", "X의 계기가 된 것은", "X가 담보하는 조건은"
⑤ 핵심 개념 3개 이상 선정 → 각 문단에서 순환 참조 (같은 개념이 다른 맥락에서 반복 등장)
⑥ 괄호 설명 전체 문장의 15% 이하로 제한
⑦ 수동·피동 구문으로 행위자 흐리기: "~에 의해 강화되어 왔다", "~로 간주되어 온"
⑧ 노트 원문 문장 직접 인용 금지 / 노트에 없는 구체적 사실(수치·고유명사) 추가 금지
⑨ 역접·양보 연결어 문단당 최소 1회 이상: "그러나", "반면", "한편", "다만", "이와 달리"
⑩ 마지막 문단은 해결되지 않은 긴장이나 열린 질문으로 마무리

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[소재 노트 내용]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${memoContentsRaw}

지금 바로 지문 본문만 출력하세요. 제목·설명·번호 없이 본문 텍스트만.`;

            let passage = '';
            try {
                passage = await this.callAPI(passagePrompt);
                if (!passage) throw new Error('지문이 비어 있습니다.');
                new obsidian.Notice(`✅ 지문 완성 (${passage.length}자). 문제 생성 중...`, 3000);
            } catch (e) {
                new obsidian.Notice('❌ 지문 생성 실패: ' + e.message); return;
            }

            // 2차 API: 문제·정답·해설 생성
            new obsidian.Notice('❓ [2/2] 문제·정답·해설 생성 중...', 5000);
            const questionPrompt =
`당신은 LEET 언어이해 문제 출제 전문가입니다.
아래 지문을 읽고 문제 3개, 선택지, 정답, 해설을 완성하세요.
반드시 아래 형식 그대로, 끊김 없이 끝까지 작성하세요.
지문 내용을 절대로 다시 출력하지 마세요. 문제와 해설만 출력하세요.

[지문]
${passage}

출력 형식 (이 형식 그대로, 지문 없이 문제부터 시작):

**1. 윗글의 내용과 일치하는 것은?**

①
②
③
④
⑤

**2. 윗글로부터 추론한 내용으로 적절하지 않은 것은?**

①
②
③
④
⑤

**3. 윗글을 바탕으로 <보기>를 이해한 내용으로 가장 적절한 것은?**

> **<보기>**
>
> [구체적 수치·조건 포함 시나리오. 변수 4개 이상, 조건 2단계 이상.]

①
②
③
④
⑤

---
⏱ 시간 제한: 7~8분

**정답: 1번-( ) / 2번-( ) / 3번-( )**

**해설**

1번: [정답 근거 + 각 오답 함정 유형]

2번: [추론 연쇄 단계 설명]

3번: [보기 조건과 지문 개념 대응 설명]

설계 원칙:
• 1번: 선택지마다 오답 함정 유형 다르게 (부분일치/주체혼동/인과혼동/조건누락/과잉일반화)
• 2번: 2단계 이상 추론 연쇄, 범위 확대 함정 포함
• 3번: 지문 개념 2개 이상 동시 적용 필요`;

            let questions = '';
            try {
                questions = await this.callAPI(questionPrompt);
                if (!questions) questions = '> ⚠️ 문제 생성 실패. 지문만 저장됨.';
            } catch (e) {
                questions = `> ⚠️ 문제 생성 오류: ${e.message}`;
            }

            // LEET 전용 노트 생성
            const now = new Date();
            const pad = n => String(n).padStart(2, '0');
            const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
            const dateFile = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`;
            const timeFile = `${pad(now.getHours())}${pad(now.getMinutes())}`;
            const sourceLinks = selectedFiles.map(f => `[[${f.file.basename}]]`).join(', ');
            const baseName = `LEET_${sourceTitleLabel}_${dateFile}`;
            const outputFolder = 'LEET연습';

            if (!this.app.vault.getAbstractFileByPath(outputFolder)) {
                await this.app.vault.createFolder(outputFolder);
            }
            let finalPath = `${outputFolder}/${baseName}.md`;
            if (this.app.vault.getAbstractFileByPath(finalPath)) {
                finalPath = `${outputFolder}/${baseName}_${timeFile}.md`;
            }

            const newContent = `---
created: ${dateStr}
sources: ${sourceLinks}
topic: ${topicType}
structure: ${structType}
status: 미풀이
tags: [LEET, 언어이해, 연습문제]
---

# LEET 문제세트 — ${sourceTitleLabel}

> [!info] 생성 정보
> 📖 소스: ${sourceLinks} | 🎯 ${topicType} | 📐 ${structType}
> 📅 ${dateStr}

---

**[1~3] 다음 글을 읽고 물음에 답하시오.**

${passage}

---

${questions}

---

## 📊 풀이 기록

| 항목 | 기록 |
|------|------|
| 풀이 시간 |  분  초 |
| 1번 선택 | ① ② ③ ④ ⑤ |
| 2번 선택 | ① ② ③ ④ ⑤ |
| 3번 선택 | ① ② ③ ④ ⑤ |
| 정답률 | /3 |

### 오답 분석

**오답 이유 & 함정:**

### 지문 구조 분석

**핵심 개념:**

**문단별 흐름:**
`;

            try {
                await this.app.vault.create(finalPath, newContent);
                new obsidian.Notice(`✅ LEET 문제세트 생성 완료!`, 4000);
                const newFile = this.app.vault.getAbstractFileByPath(finalPath);
                if (newFile) await this.app.workspace.getLeaf(false).openFile(newFile);
            } catch (e) {
                new obsidian.Notice('❌ 메모 생성 실패: ' + e.message);
            }
            return;
        }

        // ── 기타 형식 처리 ────────────────────────────────────────────
        const formatPrompts = {
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
