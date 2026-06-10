// ==========================================================================
// KU 학술 발제문 생성기 - script.js
// ==========================================================================

// 1. 상태 변수 및 로컬 스토리지 초기화
let savedPapers = [];
const STORAGE_KEY = 'ku-academic-papers';

// DOM이 완전히 로딩되면 실행
document.addEventListener('DOMContentLoaded', () => {
  loadPapersFromStorage();  // 보관함 데이터 불러오기
  setupEventListeners();    // 모든 버튼 및 슬라이더 이벤트 설정
  updateSliderBadges();     // 슬라이더 옆 수치 배지 동기화
  renderHistoryList();      // 보관함 목록 렌더링
});

// 2. 로컬 스토리지 입출력 기능
function loadPapersFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    savedPapers = JSON.parse(stored);
  }
}

function savePapersToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPapers));
}

// 3. 슬라이더 눈금 배지 실시간 동기화
function updateSliderBadges() {
  const sliders = document.querySelectorAll('.slider-input');
  sliders.forEach(slider => {
    const badge = document.getElementById(`${slider.id}-val`);
    if (badge) {
      badge.textContent = slider.value;
    }
  });
}

// 4. 이벤트 리스너 바인딩
function setupEventListeners() {
  // 폼 제출 (발제문 생성 버튼)
  const form = document.getElementById('generator-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generatePresentation();
  });

  // 슬라이더 값 변경 시 배지 수치 갱신 이벤트
  const sliders = document.querySelectorAll('.slider-input');
  sliders.forEach(slider => {
    slider.addEventListener('input', updateSliderBadges);
  });

  // 복사 버튼 이벤트
  const btnCopy = document.getElementById('btn-copy');
  btnCopy.addEventListener('click', copyToClipboard);

  // 초기화 버튼 이벤트
  const btnReset = document.getElementById('btn-reset');
  btnReset.addEventListener('click', resetForm);
}

// 5. 핵심: 발제문 빌더 엔진 (입력값 및 슬라이더 반영)
function generatePresentation() {
  // 입력 필드 수집
  const bookTitle = document.getElementById('book-title').value.trim();
  const authorName = document.getElementById('author-name').value.trim();
  const className = document.getElementById('class-name').value.trim() || "학술 세미나";
  const topic = document.getElementById('presentation-topic').value.trim();
  const rawConcepts = document.getElementById('key-concepts').value.trim();
  const quote = document.getElementById('quote').value.trim();
  const argument = document.getElementById('text-argument').value.trim();
  const critique = document.getElementById('critique').value.trim();
  const debatePoints = document.getElementById('debate-points').value.trim();
  const targetLen = parseInt(document.getElementById('word-count').value) || 1000;
  const genre = document.getElementById('genre').value;

  // 필수값 검사 (도서명, 저자명, 발제 주제, 핵심 개념, 문제의식)
  if (!bookTitle || !authorName || !topic || !rawConcepts || !critique) {
    alert("필수 항목을 입력해주세요.\n(도서/논문명, 저자명, 발제 주제, 핵심 개념, 자신의 문제의식은 필수 항목입니다.)");
    return;
  }

  // 핵심 개념 배열 파싱 (쉼표 기준)
  const concepts = rawConcepts.split(',').map(c => c.trim()).filter(c => c.length > 0);

  // 10가지 슬라이더 설정값 수집 (정수 변환 1~10)
  const sliders = {
    specificity: parseInt(document.getElementById('slider-specificity').value),
    analysis: parseInt(document.getElementById('slider-analysis').value),
    criticism: parseInt(document.getElementById('slider-criticism').value),
    creativity: parseInt(document.getElementById('slider-creativity').value),
    academic: parseInt(document.getElementById('slider-academic').value),
    readability: parseInt(document.getElementById('slider-readability').value),
    sincerity: parseInt(document.getElementById('slider-sincerity').value),
    objectivity: parseInt(document.getElementById('slider-objectivity').value),
    persuasion: parseInt(document.getElementById('slider-persuasion').value),
    salience: parseInt(document.getElementById('slider-salience').value)
  };

  // 문단 배열 생성 (총 6문단)
  const paragraphs = [];

  // 어미 스타일 정의 (학술성에 따라 변환)
  const endWith = (stdEnding, academicEnding) => {
    return sliders.academic >= 7 ? academicEnding : stdEnding;
  };

  // ----------------------------------------------------
  // 제 1문단: 도입 (도서명, 저자명, 수업명, 주제 기반 문제의식 소개)
  // ----------------------------------------------------
  let p1 = `${authorName}의 『${bookTitle}』은 ${className}에서 중점적으로 다루는 ‘${topic}’의 학술적 범주를 규명하는 데 핵심적인 텍스트${endWith("이다.", "라 할 수 있다.")} `;
  
  if (sliders.specificity >= 6) {
    p1 += `구체적으로 본 텍스트는 해당 주제의 역사적 연원과 학문적 배경을 입체적으로 추적함과 동시에, `;
  } else {
    p1 += `이 텍스트는 해당 논의가 갖는 본질적 학술 가치를 드러내며, `;
  }
  
  p1 += `우리가 안주해 온 지적 타성을 흔들어 깨우는 논리적 단초를 마련해 준${endWith("다.", "는 지점에서 그 의의를 찾을 수 있다.")} `;
  
  if (sliders.criticism >= 6) {
    p1 += `더불어 저자의 서술 방식은 주류 이론과의 유의미한 갈등 구도를 야기함으로써, 독자로 하여금 비판적 문제 제기로 나아가도록 강력히 유도한${endWith("다.", "는 점이 돋보인다.")}`;
  } else {
    p1 += `이로써 논의의 전체적인 방향성을 설정하고 독자의 이해를 돕는다.`;
  }
  paragraphs.push(p1);

  // ----------------------------------------------------
  // 제 2문단: 핵심 내용 분석 (핵심 주장 및 핵심 개념 연결)
  // ----------------------------------------------------
  let p2 = `저자가 책 전반에 걸쳐 역설하는 핵심 주장은 바로 "${argument || '본문에 내포된 핵심적인 명제'}"${endWith("이다.", "로 요약될 수 있는바, 이는 기존 학술 지평에 새로운 논쟁을 야기한다.")} `;
  
  const cList = concepts.slice(0, 3).join(', ');
  p2 += `이 논증을 지탱하는 개념적 주춧돌은 바로 ‘${cList}’ 등의 핵심 개념${endWith("들이다.", "들로 구성되어 상호 정밀하게 연동된다.")} `;
  
  if (sliders.analysis >= 6) {
    p2 += `이들 개념 사이의 구조적 인과관계 및 작동 방식을 정밀하게 들여다보는 것은 저자의 사유 체계를 해독하는 결정적 열쇠${endWith("가 된다.", "라 하겠다.")} `;
  }
  
  if (sliders.persuasion >= 7) {
    p2 += `주장과 이를 증명하기 위해 채택된 준거 틀 사이의 논리적 연결 고리는 매우 밀도 있게 구성되어 있어 설득력을 더한${endWith("다.", "는 평가를 받기에 충분하다.")}`;
  }
  paragraphs.push(p2);

  // ----------------------------------------------------
  // 제 3문단: 인용문 해석 (인상 깊었던 문장 해석 및 분석)
  // ----------------------------------------------------
  let p3 = "";
  if (quote) {
    p3 += `텍스트에 나타난 가장 인상적인 구절 중 하나인 "${quote}"라는 문장은 저자의 핵심 논리와 정밀하게 공명한${endWith("다.", "는 특성을 보인다.")} `;
    p3 += `이 구절은 텍스트의 표면적 의미에 그치지 않고, `;
    
    if (sliders.specificity >= 7) {
      p3 += `실제 역사적 전개 상황과 개별 사유 주체들의 실존적 위기를 구체적으로 상기시키는 메타포로서 강력한 학술적 함의를 갖는${endWith("다.", "다고 해석해야 마땅하다.")} `;
    } else {
      p3 += `전체 텍스트의 맥락 속에서 저자의 의도를 함축적으로 집약하고 있는${endWith("다.", " 것으로 평가된다.")} `;
    }
  } else {
    p3 += `본문에 제시된 주요 진술들은 텍스트의 뼈대를 이루며, 세부적인 논리 전개를 더욱 견고하게 보완하는 기능을 담당한${endWith("다.", "는 유의미한 구조를 보여준다.")} `;
    p3 += `이를 통해 개념적 정교함이 더해진다.`;
  }
  paragraphs.push(p3);

  // ----------------------------------------------------
  // 제 4문단: 문제의식 확장 (사용자 문제의식 제기 및 비판적 해석)
  // ----------------------------------------------------
  let p4 = "";
  if (sliders.objectivity >= 7) {
    p4 += `그러나 선행 논의가 지닌 분석적 정합성에도 불구하고, 우리는 학술적 시선에서 "${critique}"라는 근본적인 문제의식을 포착할 수 있${endWith("다.", "는 바이다.")} `;
  } else {
    p4 += `여기서 본 발제자는 저자의 논증에 온전히 안주하기보다, "${critique}"라는 비판적 질문을 가감 없이 제기하고자 한${endWith("다.", "는 입장을 견지한다.")} `;
  }

  if (sliders.criticism >= 7) {
    p4 += `저자의 전제는 지나치게 편향되어 있거나 논리적 공백이 관측되므로, 이에 대한 구체적인 대안 논리가 심도 있게 개입해야 할 것${endWith("이다.", "으로 사료된다.")} `;
  }

  if (sliders.creativity >= 6) {
    p4 += `오늘날의 시대적 변곡점과 사회적 맥락으로 논의를 넓혀 보면, 이러한 비판은 텍스트를 현대적으로 변주하고 풍부하게 해주는 창조적 확장의 발판이 된${endWith("다.", "다는 의의를 획득한다.")}`;
  }
  paragraphs.push(p4);

  // ----------------------------------------------------
  // 제 5문단: 토론 쟁점 제시 (토론 쟁점 기반 논쟁적 질문 구성)
  // ----------------------------------------------------
  let p5 = `이 비판적 시각은 자연스럽게 학술 공동체 내에서 치열하게 난상토론을 벌여야 할 핵심 논쟁 쟁점으로 귀결된${endWith("다.", "는 사실에 주목할 필요가 있다.")} `;
  
  if (debatePoints) {
    p5 += `본 세미나에서 중점적으로 다루고자 하는 구체적 쟁점은 바로 "${debatePoints}"에 대한 문제${endWith("이다.", "로 환원될 수 있는 성격을 띤다.")} `;
  }

  // 질문형 발제문의 특징 강화
  p5 += `이를 관통하는 논쟁적 물음으로서, “우리는 어떠한 사상적 기반 위에서 이를 재평가할 것인가?” 및 “저자의 명제는 현실 공간에서 유효한 실천력을 확보할 수 있는가?”라는 양자택일적 질문을 함께 던지고자 한${endWith("다.", "는 바이다.")}`;
  
  if (sliders.salience >= 7) {
    p5 += ` 특히 앞서 지적한 ‘${critique}’의 해결 가능성이 이 토론의 핵심 분수령이 될 것${endWith("이다.", "으로 예상되는 바이다.")}`;
  }
  paragraphs.push(p5);

  // ----------------------------------------------------
  // 제 6문단: 결론 (종합 및 마무리)
  // ----------------------------------------------------
  let p6 = `요약하자면, 『${bookTitle}』에 대한 분석적 독해는 저자의 명제를 단순 수용하는 차원을 넘어, `;
  
  if (sliders.creativity >= 7) {
    p6 += `새로운 지적 대안을 활발히 모색하는 역동적 사유를 추동한${endWith("다.", "다는 데 더 큰 본질적 가치가 존재한다.")} `;
  } else {
    p6 += `해당 분야의 학술적 사유 틀을 입체적으로 다지는 유의미한 계기를 선사한${endWith("다.", "다고 진단할 수 있다.")} `;
  }

  p6 += `본 발제문에서 도출된 다양한 비판적 명제들과 토론 질문들은 공동의 학습 과정에서 심층적으로 정교화될 것이며, 이는 우리 모두의 학문적 지평을 넓히는 중요한 거름${endWith("이 될 것이다.", "이 될 것임을 의심치 않는다.")}`;
  paragraphs.push(p6);

  // ----------------------------------------------------
  // 성실성(sincerity) 및 희망 글자 수(targetLen)에 따른 문단별 문장 확장 및 분량 제어
  // ----------------------------------------------------
  let finalParagraphs = [...paragraphs];
  
  if (targetLen <= 400) {
    // 500자 이하: 각 문단에서 두 문장 정도로 아주 콤팩트하게 구성
    finalParagraphs = paragraphs.map((para) => {
      // 마침표 기준으로 문장을 쪼갠 후 앞의 두 문장만 채택
      const sentences = para.split('. ').filter(s => s.trim().length > 0);
      if (sentences.length > 2) {
        return sentences.slice(0, 2).join('. ') + '.';
      }
      return para;
    });
  } else {
    // 분량 늘리기 설정 (1000자 이상이거나 성실도가 높은 경우 추가 확장 문장 적용)
    finalParagraphs = paragraphs.map((para, idx) => {
      let extraText = "";
      
      // 성실도가 높은 경우(sincerity >= 7)의 기본 확장 문장
      if (sliders.sincerity >= 7) {
        if (idx === 0) extraText += ` 이는 단순한 요약본을 제출하는 선을 넘어, 깊이 있는 학업 태도를 견지하는 고대생의 성찰적 고찰을 명징하게 드러낸다.`;
        if (idx === 1) extraText += ` 각 구성 요소의 유기적 상호작용은 이론적 안정성을 증명하는 지표가 된다.`;
        if (idx === 3) extraText += ` 이로써 논증의 스펙트럼은 더욱 넓어지며 학문적 성숙을 이끌어 낼 수 있다.`;
        if (idx === 5) extraText += ` 나아가 활발한 피드백을 통해 부족한 논점을 채우는 지식 생산의 선순환을 기대해 본다.`;
      }
      
      // 1000자~2000자(targetLen === 1500) 추가 확장 문장
      if (targetLen >= 1500) {
        if (idx === 0) extraText += ` 해당 저작이 지닌 시대적 무게와 지식적 밀도를 감안할 때, 본 텍스트는 관련 학술 담론에서 중추적인 준거점으로 작동하게 된다.`;
        if (idx === 1) extraText += ` 저자가 수사적으로 직조해 낸 논리 경로들은 독자로 하여금 주장의 현실 정합성에 동의하게 만드는 탄탄한 인과관계를 형성한다.`;
        if (idx === 2) extraText += ` 이러한 구절의 미시적 분석을 통해 텍스트 저변에 흐르는 저자의 고뇌와 서사적 맥락을 입체적으로 가늠해 볼 수 있다.`;
        if (idx === 4) extraText += ` 결국 토론에서 제기될 학술적 쟁점들은 이러한 양면성을 조명하며 다각도의 논쟁을 촉발하는 매개체가 될 것이다.`;
      }
      
      // 2000자 이상(targetLen === 2500) 강력 확장 문장 (추가 문맥과 학술적 진술 결합)
      if (targetLen >= 2500) {
        if (idx === 0) extraText += ` 이러한 이론적 중요성을 고려할 때, 우리가 다루는 의제는 현대 사회의 거시적 구조적 변화와 연결되며, 관련 학문 분야에 걸쳐 패러다임의 확장을 선도하는 중대한 지적 과제를 부과한다고 평가할 수 있다.`;
        if (idx === 1) extraText += ` 이와 같은 개념들의 구조적 정교성은 단순히 텍스트 내적 일관성을 증명하는 것을 넘어, 지성사적 맥락에서 해당 분과의 패러다임 시프트를 선도할 만큼 중차대한 이론적 잠재력을 품고 있음을 부인하기 어렵다.`;
        if (idx === 2) extraText += ` 이는 곧 텍스트 전반의 명제를 선명하게 표상하는 사유의 결정체이며, 독자는 이 진술을 매개로 하여 저자가 숨겨놓은 구조적 의미망에 접속하고 그 사상적 본질과 정밀하게 조우하게 되는 결과를 맞이한다.`;
        if (idx === 3) extraText += ` 이러한 비판적 모색은 기성의 학문적 권위에 맹목적으로 순응하는 태도를 지양하고, 독립된 연구 주체로서 텍스트의 미시적 균열을 응시하며 자기 사유의 주체성을 확립하는 주체적 학업의 과정이다.`;
        if (idx === 4) extraText += ` 이 질문은 단순히 이론의 정합성을 묻는 데 그치지 않고, 우리가 발딛고 서 있는 학문적 실천의 지평 전반을 흔들며 다각도의 후속 연구와 담론 형성을 자극하는 촉매제로 작동할 것임이 명백하다.`;
        if (idx === 5) extraText += ` 결론적으로 본 발제문이 촉발한 문제제기는 일시적인 토론에 그치지 않고, 참여자 공동의 지속적인 지적 탐구와 비판적 성찰을 견인하는 중요한 지적 자산이 될 것이며 궁극적으로 학술적 도약의 밑거름이 될 것이다.`;
      }
      
      return para + extraText;
    });
  }


  // 글의 장르(유형)에 따른 전체적인 텍스트 보정 및 커스텀 헤더 삽입
  let genreTitle = "";
  switch(genre) {
    case '발제문':
      genreTitle = `[일반 발제문] ${bookTitle}에 나타난 ${topic} 분석`;
      break;
    case '서평형 발제문':
      genreTitle = `[서평형 발제문] 독서와 사유의 확장: 『${bookTitle}』 서평`;
      // 서평형은 저자의 의도 평가에 주안점
      finalParagraphs[1] = "『서평형 분석』 " + finalParagraphs[1];
      break;
    case '비평형 발제문':
      genreTitle = `[비평형 발제문] 한계 극복을 위한 분석: 『${bookTitle}』 비판적 읽기`;
      // 비평형은 한계 분석에 주안점
      finalParagraphs[3] = "『비평적 검토』 " + finalParagraphs[3];
      break;
    case '질문탐구형 발제문':
      genreTitle = `[질문탐구형 발제문] 연구 의제 설정: ${topic}에 대한 질문과 탐색`;
      break;
    case '토론 중심 발제문':
      genreTitle = `[토론 중심 발제문] 의제 대립 분석 및 세미나 쟁점 토론지`;
      break;
  }

  // 줄글 병합
  const fullText = finalParagraphs.map(p => `<p>${p}</p>`).join('\n');
  
  // A4 종이 뷰어 영역에 출력
  const paperBody = document.getElementById('paper-content');
  paperBody.innerHTML = fullText;

  // 메타 정보 표기 동기화
  document.getElementById('paper-genre-title').textContent = genreTitle;
  document.getElementById('paper-date-info').textContent = new Date().toLocaleDateString('ko-KR');

  // 글자 수 실시간 계산 및 표시
  updateWordCount();

  // 결과물 자동 저장 (localStorage)
  const savedItem = {
    id: Date.now().toString(),
    title: genreTitle,
    date: new Date().toLocaleString('ko-KR'),
    content: fullText,
    inputs: { bookTitle, authorName, topic, rawConcepts, critique } // 재현용 원본 데이터 일부 저장
  };
  
  savedPapers.unshift(savedItem); // 최신 목록 처음에 배치
  savePapersToStorage();
  renderHistoryList();
  
  // 알림 토스트 띄우기
  showToast('발제문 초안이 성공적으로 생성 및 저장되었습니다! 📝');
}

// 6. 글자 수 계산 및 배지 갱신 기능
function updateWordCount() {
  const paperBody = document.getElementById('paper-content');
  const text = paperBody.innerText || paperBody.textContent;
  
  // 공백 제외 및 포함 글자 수 도출
  const countWithSpace = text.replace(/\\s+/g, '').length === 0 ? 0 : text.length;
  const countWithoutSpace = text.replace(/\\s+/g, '').length;
  
  const wordCountEl = document.getElementById('word-count-badge');
  if (wordCountEl) {
    wordCountEl.innerHTML = `공백 포함: <strong>${countWithSpace}</strong>자 | 공백 제외: <strong>${countWithoutSpace}</strong>자`;
  }
}

// 7. 클립보드 복사 기능
function copyToClipboard() {
  const paperBody = document.getElementById('paper-content');
  const text = paperBody.innerText || paperBody.textContent;

  if (text.includes("입력한 정보와 가중치를 바탕으로")) {
    alert("복사할 내용이 없습니다. 먼저 발제문을 생성해 주세요.");
    return;
  }

  const genreTitle = document.getElementById('paper-genre-title').textContent;
  const dateInfo = document.getElementById('paper-date-info').textContent;
  
  const formattedText = `[KU 학술 발제문 생성기 결과물]\n\n분류: ${genreTitle}\n작성일: ${dateInfo}\n\n${text}\n\n본 텍스트는 고려대학교 학술 발제문 생성기를 통해 작성된 초안입니다.`;

  navigator.clipboard.writeText(formattedText)
    .then(() => {
      showToast('발제문이 클립보드에 복사되었습니다! 📋');
    })
    .catch(err => {
      console.error('복사 중 에러:', err);
      alert('복사에 실패했습니다. 마우스로 텍스트를 긁어 복사해 주세요.');
    });
}

// 8. 보관함(히스토리) 목록 화면에 렌더링
function renderHistoryList() {
  const historyListEl = document.getElementById('history-list');
  historyListEl.innerHTML = '';

  if (savedPapers.length === 0) {
    historyListEl.innerHTML = `<div class="empty-history">보관함이 비어 있습니다. 새로운 발제문을 작성해 보세요!</div>`;
    return;
  }

  savedPapers.forEach((paper) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    
    item.innerHTML = `
      <div class="history-info" onclick="loadSavedPaper('${paper.id}')">
        <span class="history-title">${paper.title}</span>
        <span class="history-date">${paper.date}</span>
      </div>
      <button class="btn-delete-history" onclick="deleteSavedPaper('${paper.id}', event)">삭제</button>
    `;
    
    historyListEl.appendChild(item);
  });
}

// 보관함 항목 클릭 시 결과창으로 다시 로드하는 기능
window.loadSavedPaper = function(id) {
  const paper = savedPapers.find(p => p.id === id);
  if (paper) {
    const paperBody = document.getElementById('paper-content');
    paperBody.innerHTML = paper.content;

    document.getElementById('paper-genre-title').textContent = paper.title;
    document.getElementById('paper-date-info').textContent = paper.date.split(' ')[0];
    
    updateWordCount();
    showToast('저장되었던 발제문 초안을 불러왔습니다. 📂');
  }
};

// 보관함 특정 발제문 삭제 처리
window.deleteSavedPaper = function(id, event) {
  event.stopPropagation(); // 부모 클릭 이벤트(불러오기) 방지
  if (confirm("이 기록을 삭제하시겠습니까?")) {
    savedPapers = savedPapers.filter(p => p.id !== id);
    savePapersToStorage();
    renderHistoryList();
    showToast('보관함에서 삭제되었습니다. 🗑️');
  }
};

// 9. 폼 리셋 기능 (입력 필드 및 가중치 초기화)
function resetForm() {
  if (confirm("모든 입력값과 가중치를 초기화하시겠습니까?")) {
    document.getElementById('generator-form').reset();
    
    // 슬라이더 값 동기화 배지 강제 재조정
    setTimeout(() => {
      updateSliderBadges();
    }, 50);

    // 결과창 리셋
    const paperBody = document.getElementById('paper-content');
    paperBody.innerHTML = `<p class="placeholder-text">왼쪽 입력창에 도서 정보와 문제의식을 입력하고,<br>원하는 글의 성격을 조절한 후 <strong>"발제문 생성"</strong> 버튼을 눌러주세요.</p>`;
    
    document.getElementById('paper-genre-title').textContent = '학술 발제문 초안';
    document.getElementById('paper-date-info').textContent = '-';
    
    const wordCountEl = document.getElementById('word-count-badge');
    if (wordCountEl) {
      wordCountEl.innerHTML = '글자 수: <strong>0</strong>자';
    }

    showToast('모든 양식이 초기화되었습니다. 🔄');
  }
}

// 10. 토스트 알림 함수
let toastTimeout = null;
function showToast(message) {
  const toastEl = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  
  clearTimeout(toastTimeout);
  toastMsg.textContent = message;
  toastEl.classList.add('show');
  
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2500);
}
