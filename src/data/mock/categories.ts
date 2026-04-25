import type { ExamCategoryInfo } from '@/types';

export const mockCategories: ExamCategoryInfo[] = [
  {
    id: '9급_국가직',
    name: '9급 국가직 공무원',
    description: '국가직 9급 공무원 시험 - 국어, 영어, 한국사 및 선택과목',
    icon: '🏛️',
    color: '#3B82F6',
    subjects: [
      {
        id: '국어',
        name: '국어',
        units: [
          { id: '국어_어법_맞춤법', name: '어법·맞춤법', subjectId: '국어' },
          { id: '국어_문학', name: '문학', subjectId: '국어' },
          { id: '국어_비문학', name: '비문학·독해', subjectId: '국어' },
          { id: '국어_어휘_한자', name: '어휘·한자', subjectId: '국어' },
          { id: '국어_화법_작문', name: '화법·작문', subjectId: '국어' },
        ],
      },
      {
        id: '영어',
        name: '영어',
        units: [
          { id: '영어_문법', name: '문법', subjectId: '영어' },
          { id: '영어_독해', name: '독해', subjectId: '영어' },
          { id: '영어_어휘', name: '어휘', subjectId: '영어' },
          { id: '영어_생활영어', name: '생활영어', subjectId: '영어' },
        ],
      },
      {
        id: '한국사',
        name: '한국사',
        units: [
          { id: '한국사_선사_고대', name: '선사시대·고대', subjectId: '한국사' },
          { id: '한국사_고려', name: '고려시대', subjectId: '한국사' },
          { id: '한국사_조선', name: '조선시대', subjectId: '한국사' },
          { id: '한국사_근현대', name: '근·현대사', subjectId: '한국사' },
          { id: '한국사_문화사', name: '문화사', subjectId: '한국사' },
        ],
      },
      {
        id: '행정학개론',
        name: '행정학개론',
        units: [
          { id: '행정학_행정학총론', name: '행정학 총론', subjectId: '행정학개론' },
          { id: '행정학_정책론', name: '정책론', subjectId: '행정학개론' },
          { id: '행정학_조직론', name: '조직론', subjectId: '행정학개론' },
          { id: '행정학_인사행정론', name: '인사행정론', subjectId: '행정학개론' },
          { id: '행정학_재무행정론', name: '재무행정론', subjectId: '행정학개론' },
        ],
      },
      {
        id: '행정법총론',
        name: '행정법총론',
        units: [
          { id: '행정법_행정법통론', name: '행정법 통론', subjectId: '행정법총론' },
          { id: '행정법_행정작용법', name: '행정작용법', subjectId: '행정법총론' },
          { id: '행정법_행정구제법', name: '행정구제법', subjectId: '행정법총론' },
          { id: '행정법_행정조직법', name: '행정조직법', subjectId: '행정법총론' },
        ],
      },
    ],
  },
  {
    id: '9급_지방직',
    name: '9급 지방직 공무원',
    description: '지방직 9급 공무원 시험 - 국어, 영어, 한국사 및 선택과목',
    icon: '🏙️',
    color: '#10B981',
    subjects: [
      {
        id: '국어',
        name: '국어',
        units: [
          { id: '국어_어법_맞춤법', name: '어법·맞춤법', subjectId: '국어' },
          { id: '국어_문학', name: '문학', subjectId: '국어' },
          { id: '국어_비문학', name: '비문학·독해', subjectId: '국어' },
          { id: '국어_어휘_한자', name: '어휘·한자', subjectId: '국어' },
          { id: '국어_화법_작문', name: '화법·작문', subjectId: '국어' },
        ],
      },
      {
        id: '영어',
        name: '영어',
        units: [
          { id: '영어_문법', name: '문법', subjectId: '영어' },
          { id: '영어_독해', name: '독해', subjectId: '영어' },
          { id: '영어_어휘', name: '어휘', subjectId: '영어' },
          { id: '영어_생활영어', name: '생활영어', subjectId: '영어' },
        ],
      },
      {
        id: '한국사',
        name: '한국사',
        units: [
          { id: '한국사_선사_고대', name: '선사시대·고대', subjectId: '한국사' },
          { id: '한국사_고려', name: '고려시대', subjectId: '한국사' },
          { id: '한국사_조선', name: '조선시대', subjectId: '한국사' },
          { id: '한국사_근현대', name: '근·현대사', subjectId: '한국사' },
          { id: '한국사_문화사', name: '문화사', subjectId: '한국사' },
        ],
      },
      {
        id: '사회복지학',
        name: '사회복지학',
        units: [
          { id: '사회복지_개론', name: '사회복지 개론', subjectId: '사회복지학' },
          { id: '사회복지_정책론', name: '사회복지 정책론', subjectId: '사회복지학' },
          { id: '사회복지_실천론', name: '사회복지 실천론', subjectId: '사회복지학' },
          { id: '사회복지_법제론', name: '사회복지 법제론', subjectId: '사회복지학' },
        ],
      },
      {
        id: '교육학개론',
        name: '교육학개론',
        units: [
          { id: '교육학_교육철학', name: '교육철학·역사', subjectId: '교육학개론' },
          { id: '교육학_교육심리', name: '교육심리', subjectId: '교육학개론' },
          { id: '교육학_교육과정', name: '교육과정', subjectId: '교육학개론' },
          { id: '교육학_교육행정', name: '교육행정', subjectId: '교육학개론' },
        ],
      },
    ],
  },
  {
    id: '경찰_공채',
    name: '경찰공무원 공개채용',
    description: '경찰공무원 공채 시험 - 한국사, 영어, 형사법, 경찰학개론',
    icon: '👮',
    color: '#6366F1',
    subjects: [
      {
        id: '한국사',
        name: '한국사',
        units: [
          { id: '한국사_선사_고대', name: '선사시대·고대', subjectId: '한국사' },
          { id: '한국사_고려', name: '고려시대', subjectId: '한국사' },
          { id: '한국사_조선', name: '조선시대', subjectId: '한국사' },
          { id: '한국사_근현대', name: '근·현대사', subjectId: '한국사' },
          { id: '한국사_문화사', name: '문화사', subjectId: '한국사' },
        ],
      },
      {
        id: '영어',
        name: '영어',
        units: [
          { id: '영어_문법', name: '문법', subjectId: '영어' },
          { id: '영어_독해', name: '독해', subjectId: '영어' },
          { id: '영어_어휘', name: '어휘', subjectId: '영어' },
          { id: '영어_생활영어', name: '생활영어', subjectId: '영어' },
        ],
      },
      {
        id: '형사법',
        name: '형사법',
        units: [
          { id: '형사법_형법총론', name: '형법 총론', subjectId: '형사법' },
          { id: '형사법_형법각론', name: '형법 각론', subjectId: '형사법' },
          { id: '형사법_형사소송법', name: '형사소송법', subjectId: '형사법' },
        ],
      },
      {
        id: '경찰학개론',
        name: '경찰학개론',
        units: [
          { id: '경찰학_경찰과인권', name: '경찰과 인권', subjectId: '경찰학개론' },
          { id: '경찰학_경찰행정법', name: '경찰행정법', subjectId: '경찰학개론' },
          { id: '경찰학_경찰조직관리', name: '경찰조직관리론', subjectId: '경찰학개론' },
          { id: '경찰학_범죄학', name: '범죄학', subjectId: '경찰학개론' },
        ],
      },
    ],
  },
  {
    id: '소방_공채',
    name: '소방공무원 공개채용',
    description: '소방공무원 공채 시험 - 국어, 한국사, 영어, 소방학개론, 소방관계법규',
    icon: '🚒',
    color: '#EF4444',
    subjects: [
      {
        id: '국어',
        name: '국어',
        units: [
          { id: '국어_어법_맞춤법', name: '어법·맞춤법', subjectId: '국어' },
          { id: '국어_문학', name: '문학', subjectId: '국어' },
          { id: '국어_비문학', name: '비문학·독해', subjectId: '국어' },
          { id: '국어_어휘_한자', name: '어휘·한자', subjectId: '국어' },
        ],
      },
      {
        id: '한국사',
        name: '한국사',
        units: [
          { id: '한국사_선사_고대', name: '선사시대·고대', subjectId: '한국사' },
          { id: '한국사_고려', name: '고려시대', subjectId: '한국사' },
          { id: '한국사_조선', name: '조선시대', subjectId: '한국사' },
          { id: '한국사_근현대', name: '근·현대사', subjectId: '한국사' },
        ],
      },
      {
        id: '영어',
        name: '영어',
        units: [
          { id: '영어_문법', name: '문법', subjectId: '영어' },
          { id: '영어_독해', name: '독해', subjectId: '영어' },
          { id: '영어_어휘', name: '어휘', subjectId: '영어' },
        ],
      },
      {
        id: '소방학개론',
        name: '소방학개론',
        units: [
          { id: '소방학_소방조직', name: '소방조직', subjectId: '소방학개론' },
          { id: '소방학_화재이론', name: '화재이론', subjectId: '소방학개론' },
          { id: '소방학_소방시설', name: '소방시설', subjectId: '소방학개론' },
          { id: '소방학_구조구급', name: '구조·구급', subjectId: '소방학개론' },
        ],
      },
      {
        id: '소방관계법규',
        name: '소방관계법규',
        units: [
          { id: '소방법_소방기본법', name: '소방기본법', subjectId: '소방관계법규' },
          { id: '소방법_소방시설법', name: '소방시설 설치 및 관리에 관한 법률', subjectId: '소방관계법규' },
          { id: '소방법_화재예방법', name: '화재의 예방 및 안전관리에 관한 법률', subjectId: '소방관계법규' },
        ],
      },
    ],
  },
  {
    id: '5급_PSAT',
    name: '5급 공무원 PSAT',
    description: '5급 공무원 공채 및 민간경력자 PSAT 시험',
    icon: '📊',
    color: '#F59E0B',
    subjects: [
      {
        id: '언어논리',
        name: '언어논리',
        units: [
          { id: '언어논리_독해', name: '독해·이해', subjectId: '언어논리' },
          { id: '언어논리_논리게임', name: '논리게임', subjectId: '언어논리' },
          { id: '언어논리_논증분석', name: '논증분석', subjectId: '언어논리' },
          { id: '언어논리_글의구조', name: '글의 구조 파악', subjectId: '언어논리' },
        ],
      },
      {
        id: '자료해석',
        name: '자료해석',
        units: [
          { id: '자료해석_표분석', name: '표 분석', subjectId: '자료해석' },
          { id: '자료해석_그래프분석', name: '그래프 분석', subjectId: '자료해석' },
          { id: '자료해석_복합자료', name: '복합 자료 분석', subjectId: '자료해석' },
        ],
      },
      {
        id: '상황판단',
        name: '상황판단',
        units: [
          { id: '상황판단_법조문', name: '법조문형', subjectId: '상황판단' },
          { id: '상황판단_계산형', name: '계산형', subjectId: '상황판단' },
          { id: '상황판단_퍼즐형', name: '퍼즐·논리형', subjectId: '상황판단' },
          { id: '상황판단_정보추론', name: '정보추론형', subjectId: '상황판단' },
        ],
      },
    ],
  },
  {
    id: '전산직_9급',
    name: '전산직 9급 공무원',
    description: '전산직 9급 공무원 시험 - 국어, 영어, 한국사, 컴퓨터일반, 정보보호론',
    icon: '💻',
    color: '#8B5CF6',
    subjects: [
      {
        id: '국어',
        name: '국어',
        units: [
          { id: '국어_어법_맞춤법', name: '어법·맞춤법', subjectId: '국어' },
          { id: '국어_문학', name: '문학', subjectId: '국어' },
          { id: '국어_비문학', name: '비문학·독해', subjectId: '국어' },
          { id: '국어_어휘_한자', name: '어휘·한자', subjectId: '국어' },
        ],
      },
      {
        id: '영어',
        name: '영어',
        units: [
          { id: '영어_문법', name: '문법', subjectId: '영어' },
          { id: '영어_독해', name: '독해', subjectId: '영어' },
          { id: '영어_어휘', name: '어휘', subjectId: '영어' },
          { id: '영어_생활영어', name: '생활영어', subjectId: '영어' },
        ],
      },
      {
        id: '한국사',
        name: '한국사',
        units: [
          { id: '한국사_선사_고대', name: '선사시대·고대', subjectId: '한국사' },
          { id: '한국사_고려', name: '고려시대', subjectId: '한국사' },
          { id: '한국사_조선', name: '조선시대', subjectId: '한국사' },
          { id: '한국사_근현대', name: '근·현대사', subjectId: '한국사' },
        ],
      },
      {
        id: '컴퓨터일반',
        name: '컴퓨터일반',
        units: [
          { id: '컴퓨터_자료구조알고리즘', name: '자료구조·알고리즘', subjectId: '컴퓨터일반' },
          { id: '컴퓨터_운영체제', name: '운영체제', subjectId: '컴퓨터일반' },
          { id: '컴퓨터_데이터베이스', name: '데이터베이스', subjectId: '컴퓨터일반' },
          { id: '컴퓨터_네트워크', name: '네트워크', subjectId: '컴퓨터일반' },
          { id: '컴퓨터_프로그래밍', name: '프로그래밍 언어', subjectId: '컴퓨터일반' },
        ],
      },
      {
        id: '정보보호론',
        name: '정보보호론',
        units: [
          { id: '정보보호_암호학', name: '암호학', subjectId: '정보보호론' },
          { id: '정보보호_네트워크보안', name: '네트워크 보안', subjectId: '정보보호론' },
          { id: '정보보호_시스템보안', name: '시스템 보안', subjectId: '정보보호론' },
          { id: '정보보호_법규', name: '정보보호 법규', subjectId: '정보보호론' },
        ],
      },
    ],
  },
];
