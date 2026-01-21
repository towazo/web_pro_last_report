import { useState, useEffect, useMemo, useRef } from 'react';

// ============================================================================
// 1. Constants & Data
// ============================================================================

const WATCHED_TITLES = [
  "鬼滅の刃",
  "ちはやふる",
  "コードギアス 反逆のルルーシュ",
  "化物語",
  "STEINS;GATE",
  "ヴァイオレット・エヴァーガーデン",
  "進撃の巨人",
  "SPY×FAMILY",
  "呪術廻戦",
  "新世紀エヴァンゲリオン",
  "ソードアート・オンライン",
  "魔法少女まどか☆マギカ",
  "宇宙よりも遠い場所",
  "四月は君の嘘",
  "ハイキュー!!",
  "僕のヒーローアカデミア",
  "推しの子",
  "葬送のフリーレン",
  "リコリス・リコイル",
  "ぼっち・ざ・ろっく！",
];

const ANIME_DESCRIPTIONS = {
  "鬼滅の刃": "時は大正、日本。炭を売る心優しき少年・炭治郎は、ある日鬼に家族を皆殺しにされてしまう。さらに唯一生き残った妹の禰豆子は鬼に変貌してしまった。絶望的な現実に打ちのめされる炭治郎だったが、妹を人間に戻し、家族を殺した鬼を討つため、「鬼殺隊」の道を進む決意をする。",
  "ちはやふる": "「競技かるた」に懸ける高校生たちの青春を描く物語。小学6年生の千早は、転校生の新に出会い、かるたの魅力に引き込まれる。高校生になった千早は、幼馴染の太一とともに「競技かるた部」を設立し、全国大会を目指して仲間と共に成長していく。",
  "コードギアス 反逆のルルーシュ": "皇暦2010年、神聖ブリタニア帝国に占領された日本。ブリタニアの皇子でありながら国を憎むルルーシュは、謎の少女C.C.から絶対遵守の力「ギアス」を授かる。仮面の男「ゼロ」となり、黒の騎士団を率いて、世界を壊し世界を創るための反逆を開始する。",
  "化物語": "高校3年生の阿良々木暦は、春休みに吸血鬼と遭遇したことで「怪異」に関わる体質となってしまう。ある日、彼は同級生の戦場ヶ原ひたぎの抱える「重さがない」という秘密を知り、彼女を助けるために奔走する。様々な少女たちと怪異を巡る不思議な物語。",
  "STEINS;GATE": "秋葉原を拠点とする小さな発明サークル「未来ガジェット研究所」。リーダーの岡部倫太郎は、偶然にも過去へとメールを送れる「タイムマシン」を発明してしまう。興味本位で過去への干渉を繰り返すうち、彼は世界規模の大事件と悲劇的な運命に巻き込まれていく。",
  "ヴァイオレット・エヴァーガーデン": "「愛してる」の意味を知るために。戦場で「兵器」として育てられた少女ヴァイオレットは、戦争が終わり、手紙を代筆する「自動手記人形」としての仕事を始める。様々な依頼主の想いに触れる中で、彼女は少しずつ人間の感情と言葉の意味を理解していく。",
  "進撃の巨人": "巨人がすべてを支配する世界。巨人の餌と化した人類は、巨大な壁を築き、壁外への自由と引き換えに侵略を防いでいた。だが名ばかりの平和は、超大型巨人の出現により壁とともに崩れ去る。少年エレンは母を殺した巨人を駆逐するため、調査兵団に入団し過酷な戦いに挑む。",
  "SPY×FAMILY": "凄腕スパイの<黄昏>は、より良き世界のため、ある極秘任務を課せられる。それは、精神科医ロイド・フォージャーに扮し、偽りの家族を作ること。しかし、娘・アーニャは超能力者、妻・ヨルは殺し屋だった！互いに正体を隠した仮初めの家族が、受験と世界の危機に立ち向かう痛快コメディ。",
  "呪術廻戦": "驚異的な身体能力を持つ高校生・虎杖悠仁は、呪いに襲われた仲間を救うため、特級呪物「両面宿儺の指」を喰らい、己の魂に呪いを宿してしまう。最強の呪術師・五条悟の案内で「東京都立呪術高等専門学校」に入学した虎杖は、呪いを祓うべく、壮絶な戦いの世界へと足を踏み入れる。",
  "新世紀エヴァンゲリオン": "未曾有の大災害「セカンドインパクト」後の世界。第3新東京市に襲来する謎の敵「使徒」に対抗できるのは、汎用人型決戦兵器エヴァンゲリオンのみだった。父に呼び出された14歳の少年・碇シンジは、EVA初号機のパイロットとして、世界の命運を背負い戦うことになる。",
  "ソードアート・オンライン": "次世代VRMMORPG「ソードアート・オンライン」にログインしたキリトは、開発者から恐るべき真実を告げられる。それは、ゲーム内での死が現実世界での死を意味するデスゲームだった。キリトはログアウト不可の仮想世界で生き残るため、最上層の第100層を目指して戦い続ける。",
  "魔法少女まどか☆マギカ": "見滝原中学校に通う普通の中学2年生・鹿目まどかは、不思議な生き物キュゥべえと出会い、魔法少女になる契約を迫られる。だが、その傍らには魔法少女として戦う転校生・暁美ほむらの姿があった。願いを叶えた代償として背負う、魔法少女たちの過酷な運命を描く。",
  "宇宙よりも遠い場所": "「南極」を目指す女子高生たちの青春グラフィティ。何かを成し遂げたいと思いながらも一歩を踏み出せない玉木マリ（キマリ）は、南極に行くことを夢見る小淵沢報瀬と出会う。周囲に無謀だと笑われても諦めない彼女の姿に心を動かされ、少女たちは「宇宙よりも遠い場所」を目指す旅に出る。",
  "四月は君の嘘": "母の死をきっかけにピアノが弾けなくなった元天才少年・有馬公生。モノクロームだった彼の日常は、天真爛漫なヴァイオリニスト・宮園かをりとの出会いによって色付き始める。彼女の強引な誘いで再び音楽と向き合う公生だったが、彼女にはある秘密があった。",
  "ハイキュー!!": "ふとしたきっかけでバレーボールに魅せられた少年・日向翔陽。「コート上の王様」影山飛雄に惨敗した中学時代のリベンジを誓い、烏野高校バレー部に入部するが、そこにはなんと影山の姿が。反目しあう二人が、コンビネーションを武器に全国大会を目指す。",
  "僕のヒーローアカデミア": "総人口の約8割が何らかの超常能力「個性」を持つ世界。「無個性」で生まれた少年・緑谷出久は、ヒーローになる夢を諦めきれずにいた。憧れのNo.1ヒーロー・オールマイトに見出され、個性を継承した彼は、ヒーロー輩出の名門・雄英高校で最高のヒーローを目指す。",
  "推しの子": "地方都市で働く産婦人科医・ゴローの前に現れたのは、彼の「推し」アイドル・星野アイだった。彼女の妊娠・出産という秘密を守り抜こうとするゴローだったが、何者かに殺害されてしまう。目が覚めると、彼はアイの双子の息子・アクアとして転生していた。芸能界の光と闇を描く衝撃作。",
  "葬送のフリーレン": "魔王を倒した勇者一行の後日譚。エルフの魔法使いフリーレンは、長命ゆえに仲間の老いと死を見送ることになる。「人を知る」ための旅に出た彼女は、新たな仲間と共に、かつての冒険の足跡を辿りながら、かけがえのない思い出と向き合っていく。",
  "リコリス・リコイル": "犯罪を未然に防ぐ秘密組織「DA」。そのエージェントである少女たち「リコリス」。歴代最強のリコリスと称される千束と、優秀だがワケありのたきなは、喫茶「リコリコ」で働きながら様々な依頼をこなしていく。凸凹コンビの日常とガンアクション。",
  "ぼっち・ざ・ろっく！": "極度の人見知りで陰キャな少女・後藤ひとりは、バンド活動に憧れてギターを始めるが、友達がいないため一人で練習する毎日。ある日、「結束バンド」に誘われたことで彼女の日常は一変する。コミュ障ながらも音楽を通じて成長していくバンドストーリー。"
};

const GENRE_TRANSLATIONS = {
  "Action": "アクション",
  "Adventure": "冒険",
  "Comedy": "コメディ",
  "Drama": "ドラマ",
  "Ecchi": "お色気",
  "Fantasy": "ファンタジー",
  "Horror": "ホラー",
  "Mahou Shoujo": "魔法少女",
  "Mecha": "メカ",
  "Music": "音楽",
  "Mystery": "ミステリー",
  "Psychological": "サイコ",
  "Romance": "恋愛",
  "Sci-Fi": "SF",
  "Slice of Life": "日常",
  "Sports": "スポーツ",
  "Supernatural": "超常現象",
  "Thriller": "サスペンス"
};

const translateGenre = (genre) => GENRE_TRANSLATIONS[genre] || genre;

// ============================================================================
// 2. API Helper Functions
// ============================================================================

const ANIME_QUERY = `
  query ($search: String) {
    Media (search: $search, type: ANIME) {
      id
      title {
        native
        romaji
        english
      }
      coverImage {
        extraLarge
        large
      }
      seasonYear
      episodes
      genres
      bannerImage
      description
    }
  }
`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAnimeDetails = async (title) => {
  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: ANIME_QUERY,
        variables: { search: title }
      })
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.data?.Media;
  } catch (error) {
    console.error(`Error fetching ${title}:`, error);
    return null;
  }
};

// ============================================================================
// 3. Components
// ============================================================================

function LoadingOverlay({ loaded, total }) {
  return (
    <div className="loading-bar-container">
      <div className="loading-text">
        作品データを取得中... {loaded} / {total}
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(loaded / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function Hero({ anime }) {
  if (!anime) return null;

  const bgImage = anime.bannerImage || anime.coverImage.extraLarge;

  // Try to find a local Japanese description first
  const localDesc = ANIME_DESCRIPTIONS[anime.title.native];
  const description = localDesc || anime.description || '詳細情報がありません。';

  // Only show translate link if we are using the English API description
  const isEnglishDesc = !localDesc && anime.description;
  const cleanDesc = isEnglishDesc ? description.replace(/<br>/g, '\n').replace(/<[^>]+>/g, '') : '';

  return (
    <section className="hero">
      {/* Background container style trick if needed, but per request simplified CSS doesn't use bg image on hero div contextually same way */}
      <div className="hero-content">
        <span className="badge">今日の一本</span>
        <h1>{anime.title.native || anime.title.romaji}</h1>
        <div className="hero-meta">
          <span>{anime.seasonYear || '不明'}</span>
          <span className="dot">•</span>
          <span>{anime.genres.slice(0, 3).map(translateGenre).join(' / ')}</span>
          <span className="dot">•</span>
          <span>{anime.episodes || '?'} 話</span>
        </div>
        <p className="hero-desc" dangerouslySetInnerHTML={{ __html: description }} />

        {isEnglishDesc && (
          <div className="hero-actions">
            <a
              href={`https://translate.google.com/?sl=en&tl=ja&text=${encodeURIComponent(cleanDesc)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="translate-link"
            >
              <i className="icon">🌐</i> あらすじを翻訳 (Google)
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function AnimeCard({ anime, onRemove }) {
  return (
    <div className="anime-card">
      <div className="card-image-wrapper">
        <img
          src={anime.coverImage.large}
          alt={anime.title.native}
          loading="lazy"
        />
        <div className="episodes-badge">{anime.episodes || '?'} 話</div>
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`「${anime.title.native || anime.title.romaji}」を削除しますか？`)) {
              onRemove(anime.id);
            }
          }}
          title="削除"
        >
          🗑️
        </button>
      </div>
      <div className="card-info">
        <h3>{anime.title.native || anime.title.romaji}</h3>
        <div className="card-meta">
          <span className="year">{anime.seasonYear || '不明'}</span>
        </div>
        <div className="card-genres">
          {anime.genres.slice(0, 2).map(g => (
            <span key={g} className="genre-tag">{translateGenre(g)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. Main App Component
// ============================================================================

function App() {
  // Initialize state from localStorage if available
  const [animeList, setAnimeList] = useState(() => {
    const saved = localStorage.getItem('myAnimeList');
    return saved ? JSON.parse(saved) : [];
  });

  const [loadingStatus, setLoadingStatus] = useState({ loaded: 0, total: WATCHED_TITLES.length, active: false });
  const [isAdding, setIsAdding] = useState(false); // New state for add loading
  const [featuredAnime, setFeaturedAnime] = useState(null);
  const [error, setError] = useState(null);
  const ignoreFetch = useRef(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  // New Title Input
  const [newTitle, setNewTitle] = useState("");

  // Persist to localStorage whenever animeList changes
  useEffect(() => {
    if (animeList.length > 0) {
      localStorage.setItem('myAnimeList', JSON.stringify(animeList));
    }
  }, [animeList]);

  // Initial Data Fetching
  useEffect(() => {
    // If we already have data (from localStorage), don't fetch initial list
    if (animeList.length > 0) {
      const random = animeList[Math.floor(Math.random() * animeList.length)];
      setFeaturedAnime(random);
      return;
    }

    if (ignoreFetch.current) return;
    ignoreFetch.current = true;

    const loadAllAnime = async () => {
      setLoadingStatus(prev => ({ ...prev, active: true }));
      const results = [];
      let failureCount = 0;

      for (let i = 0; i < WATCHED_TITLES.length; i++) {
        const title = WATCHED_TITLES[i];
        setLoadingStatus(prev => ({ ...prev, loaded: i + 1 }));

        // Fetch
        const data = await fetchAnimeDetails(title);

        if (data) {
          results.push(data);
          // Set featured anime as soon as we have at least one, if not set
          if (!featuredAnime && results.length > 0) {
            // Placeholder logic handled later
          }
        } else {
          failureCount++;
          if (failureCount > 3 && results.length === 0) {
            setError("データの取得に失敗しました。APIのレート制限（アクセス過多）の可能性があります。1分ほど待ってからリロードしてください。");
            break;
          }
        }

        // Delay to respect API limits (800ms)
        await sleep(800);
      }

      setAnimeList(results);
      setLoadingStatus(prev => ({ ...prev, active: false }));

      if (results.length > 0) {
        const random = results[Math.floor(Math.random() * results.length)];
        setFeaturedAnime(random);
      } else if (!error) {
        if (failureCount === WATCHED_TITLES.length) {
          setError("作品データが見つかりませんでした。通信環境を確認するか、しばらく待ってから再試行してください。");
        }
      }
    };

    loadAllAnime();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddAnime = async () => {
    if (!newTitle.trim()) return;
    setIsAdding(true);
    setError(null);

    const data = await fetchAnimeDetails(newTitle);

    if (data) {
      // Check for duplicates
      if (animeList.some(a => a.id === data.id)) {
        setError("その作品は既に追加されています。");
      } else {
        setAnimeList(prev => [data, ...prev]);
        setNewTitle("");
        setError(null);
      }
    } else {
      setError("作品が見つかりませんでした。タイトルが正しいか確認してください。");
    }
    setIsAdding(false);
  };

  const handleRemoveAnime = (id) => {
    setAnimeList(prev => {
      const updated = prev.filter(anime => anime.id !== id);
      // Update localStorage immediately inside setter or via useEffect logic.
      // Since we have the useEffect hook watching animeList, it will handle it.
      // BUT: If the list becomes empty, the useEffect with > 0 check won't run/clean up properly if we want to clear local storage.
      // However logic says > 0. Let's fix persistence logic to handle empty array if needed, 
      // but "if animeList.length > 0" in useEffect means we never save empty list? 
      // It's safer to save empty list too if user deleted everything.
      if (updated.length === 0) {
        localStorage.removeItem('myAnimeList');
      }
      return updated;
    });
  };

  // Derived state for genres
  const uniqueGenres = useMemo(() => {
    const genres = new Set();
    animeList.forEach(anime => {
      anime.genres?.forEach(g => genres.add(g));
    });
    return ["All", ...Array.from(genres).sort()];
  }, [animeList]);

  // Derived state for filtered list
  const filteredList = useMemo(() => {
    return animeList.filter(anime => {
      const titleNative = anime.title.native || "";
      const titleRomaji = anime.title.romaji || "";
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch =
        titleNative.toLowerCase().includes(searchLower) ||
        titleRomaji.toLowerCase().includes(searchLower);

      const matchesGenre = selectedGenre === "All" || anime.genres.includes(selectedGenre);

      return matchesSearch && matchesGenre;
    });
  }, [animeList, searchQuery, selectedGenre]);

  return (
    <div className="app-container">
      {/* Loading Overlay */}
      {loadingStatus.active && !error && (
        <LoadingOverlay loaded={loadingStatus.loaded} total={loadingStatus.total} />
      )}

      {/* Error Message */}
      {error && (
        <div className="error-banner" style={{
          position: 'fixed', bottom: '20px', left: '20px', right: '20px',
          background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '1rem',
          borderRadius: '12px', zIndex: 2000, textAlign: 'center', backdropFilter: 'blur(10px)'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="logo">AniTrigger</div>
      </header>

      {/* Featured Section */}
      {featuredAnime && <Hero anime={featuredAnime} />}

      {/* Main Content */}
      <main className="main-content">
        <div className="controls">
          <div className="search-box">
            <i className="search-icon">🔍</i>
            <input
              type="text"
              placeholder="タイトルを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>


          <div className="filter-box">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="All">すべてのジャンル</option>
              {uniqueGenres.filter(g => g !== "All").map(genre => (
                <option key={genre} value={genre}>{translateGenre(genre)}</option>
              ))}
            </select>
          </div>

          <div className="add-anime-box">
            <div className="add-input-wrapper">
              <input
                type="text"
                placeholder="新しい作品を追加 (例: NARUTO)..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAnime()}
              />
              <button onClick={handleAddAnime} disabled={isAdding}>
                {isAdding ? '取得中...' : '追加'}
              </button>
            </div>
          </div>
        </div>

        <div className="results-count">
          {filteredList.length} 作品が見つかりました
        </div>

        <div className="anime-grid">
          {filteredList.map(anime => (
            <AnimeCard key={anime.id} anime={anime} onRemove={handleRemoveAnime} />
          ))}
        </div>

        {filteredList.length === 0 && !loadingStatus.active && (
          <div className="empty-state">該当する作品がありません</div>
        )}
      </main>

      <footer className="app-footer">
        <p>AniTrigger &copy; 2025 - Data provided by AniList API</p>
      </footer>
    </div>
  );
}

export default App;