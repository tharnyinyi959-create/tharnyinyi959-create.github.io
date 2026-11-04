/* =====================================================================
   EN / JP — the language switch in the header ("EN / JP").
   The pages are written in Japanese as usual; this file only holds the English for them:
       "日本語の文": "English sentence",
   Keys are the Japanese text exactly as on the page (spaces and line breaks don't matter).
   Text that is missing here simply stays Japanese, so editing a page never breaks it —
   add or update the line here afterwards. Text that is already English is not listed.
   The choice is kept in localStorage ("portfolio-lang"), so it follows the visitor across pages.
   Loaded on every page just before js/main.js: the page is already English before
   motion.js / v2-motion.js split headings and paragraphs into letters.
   455 entries.
   ===================================================================== */
(() => {
  "use strict";
  const EN = {
    // ---- index.html (and shared: footer, cards, alt text)
    "Thar Nyi Nyiのポートフォリオサイト。Webコーディングに情熱を注ぐフロントエンド開発学生です。":
      "Portfolio of Thar Nyi Nyi, a front-end development student with a passion for web coding.",
    "Thar Nyi Nyi の学生証 — 写真付きのIDカードがランヤード（ネックストラップ）に下がっている":
      "Thar Nyi Nyi's student ID — a photo ID card hanging from a lanyard",
    "出身はミャンマーで、現在は日本で学んでいます。子供の頃からコンピューターやテクノロジーに興味があり、画面の中で動くものづくりに魅力を感じてきました。今はWebコーディングを中心に学びながら、フロントエンドWeb開発者になることを目指しています。":
      "I'm from Myanmar and currently studying in Japan. Ever since I was a child I've been fascinated by computers and technology, and drawn to making things that move on a screen. I'm now focusing on web coding, aiming to become a front-end web developer.",
    "架空の水族館「神戸北野水族館」の公式サイトを、Figmaで企画からデザインまで一貫して制作しました。":
      "An official website for the fictional \"Kobe Kitano Aquarium\", which I planned and designed from start to finish in Figma.",
    "課題 · School Assignment — Figma":
      "School Assignment — Figma",
    "ピザ店・カフェ・和の茶房・ジム・タピオカ専門店。業種もトーンも異なる5つの架空ブランドのWebサイトを、それぞれの世界観に合わせてデザインしました。":
      "A pizzeria, a café, a Japanese tea house, a gym and a tapioca shop — websites for five fictional brands with different industries and tones, each designed to fit its own world.",
    "自己紹介サイト — Hello, I'm Thar Nyi Nyi":
      "Self-Introduction Site — Hello, I'm Thar Nyi Nyi",
    "自分自身を紹介する1ページのWebサイト。ABOUT ME・好きなもの・思い出のマップを、クリーム×ブラック×ネオンの遊び心あるデザインでまとめました。":
      "A one-page website that introduces me — About Me, my favourite things and a map of memories — in a playful cream × black × neon design.",
    "ポートフォリオサイト デザイン":
      "Portfolio Site Design",
    "自分の作品を紹介するポートフォリオサイトを、トップ・作品一覧・作品詳細・プロフィール・お問い合わせの全8ページでデザイン。ダークネイビー×オレンジで統一しました。":
      "A portfolio site to present my work, designed across 8 pages: top, works list, work details, profile and contact — unified in dark navy × orange.",
    "アートと人 — Art and Human":
      "Art and Human",
    "架空の展覧会のためのポスターを、5つの異なるビジュアルコンセプトで展開しました。":
      "Posters for a fictional exhibition, developed in five different visual concepts.",
    "課題 · School Assignment — Illustrator · Photoshop":
      "School Assignment — Illustrator · Photoshop",
    "説明会・体験入学 バナー":
      "Open Campus & Info Session Banners",
    "神戸電子専門学校 グラフィックデザイン学科の説明会・体験入学告知バナーを、4種類の広告サイズに合わせて展開しました。":
      "Banners announcing the info sessions and open campus of Kobe Denshi College's Graphic Design Department, adapted to four ad sizes.",
    "ミャンマー料理動画":
      "Myanmar Food Video",
    "ミャンマー料理「チェーオー・シーチェッ」の作り方を紹介するYouTube動画。撮影から編集、サムネイルデザインまで手がけました。":
      "A YouTube video showing how to make the Myanmar dish \"Kyay Oh Si Chat\". I handled everything from filming and editing to the thumbnail design.",
    "課題 · School Assignment — CapCut · Photoshop":
      "School Assignment — CapCut · Photoshop",
    "世界弓道大会 — World Kyudo Taikai":
      "World Kyudo Taikai",
    "「第5回世界弓道大会」のロゴを提案。弓と矢を大会略称「5WKYT」に融合させ、A3ポスター・名刺までビジュアルアイデンティティとして展開しました。":
      "A logo proposal for the \"5th World Kyudo Taikai\". The bow and arrow are merged into the event abbreviation \"5WKYT\", extended into a visual identity including an A3 poster and business cards.",
    "ミャンマーの一口 — A Bite of Myanmar":
      "A Bite of Myanmar",
    "ミャンマーと日本の料理を見開きごとに比べながら紹介する、全12ページのZINE。テラコッタと藍色の2色で、ふたつの国の食文化をつなぎました。":
      "A 12-page ZINE that introduces Myanmar and Japanese dishes side by side on each spread. Two colours, terracotta and indigo, connect the food cultures of the two countries.",
    "12星座キャラクター — Zodiac Koalas":
      "Zodiac Koalas — 12 Zodiac Characters",
    "コアラをベースに、12星座それぞれのモチーフを組み合わせたキャラクターシリーズ。夜空の背景と共通のフォーマットで、12枚をひとつのシリーズにまとめました。":
      "A character series based on a koala, combined with a motif for each of the 12 zodiac signs. A night-sky background and a shared format bring all 12 together as one series.",
    "課題 · School Assignment — Illustrator":
      "School Assignment — Illustrator",
    "Puffo — 地元のPRキャラクター":
      "Puffo — A Local PR Character",
    "夏休み課題「地元のPRキャラを作ろう」で、ミャンマーをPRするキャラクター「Puffo」を考案。小さな願いを叶える雲の妖精として、プロフィールからグッズまで設計しました。":
      "For the summer assignment \"Create a PR character for your hometown\", I created \"Puffo\", a character promoting Myanmar. A cloud fairy who grants small wishes — designed from profile to merchandise.",
    "缶バッジデザイン — ようこそ KOBE":
      "Button Badge Design — Welcome KOBE",
    "「ウェルカム（ようこそ）」をテーマにした缶バッジを2種類デザイン。神戸の街並みを描いた男性向けと、海の生きものキャラクターの女性向けで展開しました。":
      "Two button badges on the theme of \"Welcome\": one for men featuring Kobe's cityscape, and one for women featuring sea-creature characters.",
    "HAT神戸 — 縦型バナー":
      "HAT Kobe — Vertical Banner",
    "神戸の街「HAT神戸」をPRする縦型バナー（500×1000mm）。人と街と海を線画でつなぎ、明るく爽やかな配色で街の魅力を伝えます。":
      "A vertical banner (500×1000 mm) promoting the HAT Kobe district. Line drawings connect people, city and sea, and a bright, fresh palette conveys the area's charm.",
    "チョコフェス KOBE — フライヤー":
      "Choco Fes KOBE — Flyer",
    "神戸のチョコレートイベント「チョコフェス KOBE」のA4フライヤー。とろけるチョコレートと神戸の街のイラストで、甘くて楽しいイベントの雰囲気を表現しました。":
      "An A4 flyer for \"Choco Fes KOBE\", a chocolate event in Kobe. Melting chocolate and illustrations of the city express the sweet, fun atmosphere of the event.",
    "香住ふるさとまつり 海上花火大会 — ポスター":
      "Kasumi Hometown Festival Fireworks — Poster",
    "「第49回 香住ふるさとまつり 海上花火大会」の告知ポスター（B2）。夜空いっぱいの花火と金色の筆文字で、夏祭りの高揚感を表現しました。":
      "A B2 poster announcing the \"49th Kasumi Hometown Festival Fireworks over the Sea\". Fireworks filling the night sky and golden brush lettering capture the excitement of a summer festival.",
    "パーソナル名刺デザイン":
      "Personal Business Card Design",
    "自分のロゴマークを使ったパーソナル名刺。チャコールとクリームの2色に、細い金茶のラインを効かせ、落ち着いた大人っぽい印象にまとめました。":
      "A personal business card using my own logo mark. Two colours, charcoal and cream, with a thin gold-brown line for a calm, grown-up impression.",
    "神戸北野水族館 Webサイトデザイン":
      "Kobe Kitano Aquarium website design",
    "FORNO ROSSO ピザ店 Webサイトデザイン":
      "FORNO ROSSO pizzeria website design",
    "自己紹介サイト — Hello, I'm Thar Nyi Nyi — Website Design":
      "Self-Introduction Site — Hello, I'm Thar Nyi Nyi — Website Design",
    "自己紹介サイト Webデザイン":
      "Self-introduction website design",
    "ポートフォリオサイト デザイン — Website Design":
      "Portfolio Site Design — Website Design",
    "ポートフォリオサイト トップページ デザイン":
      "Portfolio site top page design",
    "アートと人 — Art and Human — Poster Design":
      "Art and Human — Poster Design",
    "アートと人 展覧会ポスター":
      "Art and Human exhibition poster",
    "説明会・体験入学 バナー — Banner Design":
      "Open Campus & Info Session Banners — Banner Design",
    "神戸電子専門学校 説明会バナー":
      "Kobe Denshi College info session banner",
    "ミャンマー料理動画 — Video Editing":
      "Myanmar Food Video — Video Editing",
    "ミャンマー料理動画 サムネイル":
      "Myanmar food video thumbnail",
    "世界弓道大会 — World Kyudo Taikai — Logo Design":
      "World Kyudo Taikai — Logo Design",
    "第5回世界弓道大会 A3ポスター":
      "5th World Kyudo Taikai A3 poster",
    "ミャンマーの一口 — A Bite of Myanmar — Editorial Design":
      "A Bite of Myanmar — Editorial Design",
    "ZINE ミャンマーの一口 表紙":
      "ZINE \"A Bite of Myanmar\" cover",
    "12星座キャラクター — Zodiac Koalas — Character Design":
      "Zodiac Koalas — 12 Zodiac Characters — Character Design",
    "12星座キャラクター しし座":
      "Zodiac character — Leo",
    "Puffo — 地元のPRキャラクター — Character Design":
      "Puffo — A Local PR Character — Character Design",
    "PRキャラクター Puffo":
      "PR character Puffo",
    "缶バッジデザイン — ようこそ KOBE — Goods Design":
      "Button Badge Design — Welcome KOBE — Goods Design",
    "ようこそ 缶バッジ 2種類":
      "Two \"Welcome\" button badges",
    "HAT神戸 — 縦型バナー — Banner Design":
      "HAT Kobe — Vertical Banner — Banner Design",
    "HAT神戸 縦型バナー":
      "HAT Kobe vertical banner",
    "チョコフェス KOBE — フライヤー — Flyer Design":
      "Choco Fes KOBE — Flyer — Flyer Design",
    "チョコフェス KOBE フライヤー":
      "Choco Fes KOBE flyer",
    "香住ふるさとまつり 海上花火大会 — ポスター — Poster Design":
      "Kasumi Hometown Festival Fireworks — Poster — Poster Design",
    "香住ふるさとまつり 海上花火大会 ポスター":
      "Kasumi Hometown Festival Fireworks poster",
    "パーソナル名刺デザイン — Business Card":
      "Personal Business Card Design — Business Card",
    "パーソナル名刺 モックアップ":
      "Personal business card mockup",
    "インターンシップ、共同制作、フロントエンドのお仕事など、幅広く募集中です。次のプロジェクトについて、ぜひお話ししましょう。":
      "I'm open to internships, collaborations and front-end work. Let's talk about your next project.",
    "フロントエンド開発学生。日本を拠点に活動中。":
      "Front-end development student based in Japan.",
    // ---- profile.html
    "Thar Nyi Nyiのプロフィール。経歴、これまでの歩み、スキルを紹介しています。":
      "Profile of Thar Nyi Nyi — background, journey and skills.",
    "Webコーディングに情熱を持つ学生として、日々スキルを磨いています。現在は日本で学びながら毎日コードを書き、使いやすいWebサイトを自分の手で実装できるフロントエンド開発者を目指しています。":
      "As a student passionate about web coding, I sharpen my skills every day. I'm studying in Japan and writing code daily, aiming to become a front-end developer who can build easy-to-use websites with my own hands.",
    "ミャンマーで育ち、子供の頃からコンピューターやテクノロジーに強い興味を持っていました。ミャンマーの大学では電気工学を3年間学びましたが、新型コロナウイルスの影響で状況が一変し、大学を続けないことを決意。新しい一歩として日本語を学び始め、日本へ来ました。":
      "I grew up in Myanmar and was strongly interested in computers and technology from childhood. I studied electrical engineering at a university in Myanmar for three years, but the COVID-19 pandemic changed everything and I decided not to continue. As a new step, I started learning Japanese and came to Japan.",
    "日本では神戸電子専門学校のグラフィックデザイン学科で学んでいますが、授業を通してデザインよりも「コードを書いて画面が実際に動く」ことに強く惹かれるようになりました。自分がつくったものがブラウザの中で実際に動き、反応する——そこに一番のやりがいを感じています。授業以外の時間は、少しずつJavaScriptに慣れながら、HTML・CSSでの実装を試しています。":
      "In Japan I'm studying in the Graphic Design Department at Kobe Denshi College, but through my classes I became more drawn to \"writing code and seeing the screen actually move\" than to design itself. Seeing something I made move and respond in the browser is what I find most rewarding. Outside class, I'm getting used to JavaScript little by little and experimenting with building in HTML and CSS.",
    "目標はシンプルです。使う人にとって心地よく、しっかり動くWebサイトを、自分の手でコーディングできるフロントエンド開発者になることです。":
      "My goal is simple: to become a front-end developer who can code websites that feel good to use and work reliably — with my own hands.",
    "コンピューターやテクノロジーに強く惹かれる子供時代を過ごす。":
      "Spent a childhood strongly drawn to computers and technology.",
    "ミャンマーの大学で電気工学を専攻し、3年間学ぶ。":
      "Majored in electrical engineering at a university in Myanmar for three years.",
    "新型コロナウイルスの影響で状況が一変し、大学を続けないことを決意。":
      "The COVID-19 pandemic changed everything; decided not to continue university.",
    "新しい一歩として日本語の勉強を始める。":
      "Started studying Japanese as a new step.",
    "新しい環境で学び直すため、ミャンマーを離れ来日。":
      "Left Myanmar for Japan to start learning again in a new environment.",
    "日本で構図・ブランディング・紙媒体からデジタルまで、デザインの基礎を学び始める。":
      "Began learning the foundations of design in Japan — composition, branding, from print to digital.",
    "ワイヤーフレームやプロトタイプ、使いやすさを意識したインターフェース設計を開始。":
      "Started designing wireframes, prototypes and interfaces with usability in mind.",
    "HTML・CSS・JavaScriptを習得し、デザインをブラウザ上で実際に動く形にする。":
      "Learned HTML, CSS and JavaScript to turn designs into something that actually works in the browser.",
    "丁寧に作り込まれたWebプロダクトを届けられるキャリアを目指して、日々努力中。":
      "Working every day toward a career delivering carefully crafted web products.",
    // ---- works.html
    "Thar Nyi Nyiによる、デザイン・開発の制作実績。":
      "Design and development work by Thar Nyi Nyi.",
    "Webデザインからグラフィックデザイン、動画編集まで。学校の課題として取り組んだ実制作を中心に紹介しています。":
      "From web design to graphic design and video editing — mainly real work produced as school assignments.",
    "架空の水族館「神戸北野水族館」の公式サイトを、企画からビジュアルデザインまでFigmaで制作。チケット購入・展示エリア紹介・アクセス情報までを、幻想的な海中の世界観でまとめました。":
      "An official website for the fictional \"Kobe Kitano Aquarium\", from planning to visual design in Figma. Ticket purchase, exhibit areas and access information, all wrapped in a dreamy underwater world.",
    "アートと人 ポスター コンセプト01":
      "Art and Human poster — concept 01",
    "アートと人 ポスター コンセプト05":
      "Art and Human poster — concept 05",
    "架空の展覧会「アートと人」のためのポスターを、5つの異なるビジュアルコンセプトで展開。同じ課題文から生まれる多様な表現を探求しました。":
      "Posters for the fictional exhibition \"Art and Human\", developed in five different visual concepts — exploring the variety of expressions that grow from a single brief.",
    "レクタングルバナー":
      "Rectangle banner",
    "スカイスクレイパーバナー":
      "Skyscraper banner",
    "リーダーボードバナー":
      "Leaderboard banner",
    "バナー ブルーバリエーション":
      "Banner — blue variation",
    "ミャンマー料理「チェーオー・シーチェッ」の作り方を紹介するYouTube動画。撮影映像の編集からサムネイルデザインまで手がけました。":
      "A YouTube video showing how to make the Myanmar dish \"Kyay Oh Si Chat\". I handled everything from editing the footage to the thumbnail design.",
    "5WKYT 名刺 表面":
      "5WKYT business card — front",
    "5WKYT 名刺 裏面":
      "5WKYT business card — back",
    "ZINE モヒンガーのページ":
      "ZINE — Mohinga page",
    "ZINE ミャンマー×日本のページ":
      "ZINE — Myanmar × Japan page",
    "12星座キャラクター おひつじ座 — Aries":
      "Zodiac character — Aries",
    "12星座キャラクター おうし座 — Taurus":
      "Zodiac character — Taurus",
    "12星座キャラクター ふたご座 — Gemini":
      "Zodiac character — Gemini",
    "12星座キャラクター かに座 — Cancer":
      "Zodiac character — Cancer",
    "12星座キャラクター しし座 — Leo":
      "Zodiac character — Leo",
    "12星座キャラクター おとめ座 — Virgo":
      "Zodiac character — Virgo",
    "Puffo キャラクターデザインシート":
      "Puffo character design sheet",
    // ---- contact.html
    "Thar Nyi Nyiへのお問い合わせ。インターンシップ・共同制作・お仕事のご相談などお気軽にご連絡ください。":
      "Contact Thar Nyi Nyi — feel free to get in touch about internships, collaborations or work.",
    "インターンシップ、共同制作、フロントエンドのお仕事など、幅広く募集中です。下記のフォームか、メール・SNSから、お気軽にご連絡ください。":
      "I'm open to internships, collaborations and front-end work. Feel free to reach out using the form below, or by email or social media.",
    "山田 太郎":
      "Taro Yamada",
    "インターンシップのご相談 / Job Inquiry / Collaboration など":
      "Internship inquiry / Job Inquiry / Collaboration, etc.",
    "お問い合わせ内容をご記入ください。":
      "Please write your message.",
    "通常1〜2営業日以内にご返信いたします。":
      "I usually reply within 1–2 business days.",
    // ---- work-brand.html
    "説明会・体験入学 バナー | Thar Nyi Nyi":
      "Open Campus & Info Session Banners | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた神戸電子専門学校 説明会・体験入学バナー広告（4サイズ展開）。":
      "Case study: web ad banners for Kobe Denshi College's info sessions and open campus by Thar Nyi Nyi (adapted to 4 sizes).",
    "← 作品一覧に戻る":
      "← Back to all works",
    "Web広告バナー（4サイズ展開）":
      "Web ad banners (4 sizes)",
    "1つのビジュアルを、広告枠の規格に合わせて再構成する":
      "Re-composing one visual to fit standard ad formats",
    "神戸電子専門学校 説明会・体験入学バナー リーダーボード":
      "Kobe Denshi College info session & open campus banner — leaderboard",
    "神戸電子専門学校 グラフィックデザイン学科の「説明会・体験入学」告知のためのWeb広告バナーを制作しました。1つのビジュアル・メッセージを、実際の広告配信で使われる4種類のサイズ規格（レクタングル・スカイスクレイパー・リーダーボード・バナー）に合わせて展開しています。":
      "I created web ad banners announcing the \"info sessions and open campus\" of Kobe Denshi College's Graphic Design Department. One visual and message were adapted to the four size formats used in real ad delivery: rectangle, skyscraper, leaderboard and banner.",
    "広告バナーは掲載面によって縦長・横長・正方形に近い形など、サイズも縦横比も大きく異なります。同じ情報量（学校名・学科名・タイトル・日程・説明内容・写真）を保ちながら、それぞれの枠の中で違和感なく、かつ短時間で内容が伝わるようにレイアウトを再構成することが課題でした。":
      "Ad banners vary greatly in size and aspect ratio depending on where they appear — tall, wide or almost square. The challenge was to re-compose the layout so that it looks natural in each frame and gets the message across in a short time, while keeping the same information: school name, department, title, dates, details and photo.",
    "ベースとなる要素（ロゴ・見出し・日程・写真・説明会情報）をパーツごとに分解し、サイズごとに優先順位を変えながら再配置しました。縦長サイズでは要素を上から下へ積み重ね、横長サイズでは左にテキスト・右に写真という視線誘導を意識しています。また、同じレイアウトでもティール×ピンクの配色とブルー系の配色、2パターンのカラーバリエーションを用意し、掲載媒体によって使い分けられるようにしました。":
      "I broke the base elements (logo, heading, dates, photo, session details) into parts and rearranged them for each size, changing their priority. Tall sizes stack the elements from top to bottom, while wide sizes guide the eye with text on the left and a photo on the right. I also prepared two colour variations of the same layout — teal × pink and a blue scheme — so they can be used to suit each medium.",
    "実際の広告枠でよく使われる4つの標準サイズに展開しました。":
      "Adapted to four standard sizes commonly used in real ad slots.",
    "レクタングルバナー 300x279":
      "Rectangle banner 300x279",
    "スカイスクレイパーバナー 160x600":
      "Skyscraper banner 160x600",
    "リーダーボードバナー 728x90":
      "Leaderboard banner 728x90",
    "バナー 468x60（ブルーカラーバリエーション）":
      "Banner 468x60 (blue colour variation)",
    "Banner · 468×60（Blue Variant）":
      "Banner · 468×60 (Blue Variant)",
    "1つのデザインを複数サイズに展開する作業を通して、「レイアウトの骨組み」と「装飾」を分けて考えることの大切さを学びました。特にスカイスクレイパーのような極端に縦長のサイズでは、通常のレイアウト発想がそのまま通用せず、情報を積み木のように組み替える発想が必要でした。実務の広告制作に近い、規格に合わせるデザインの難しさと面白さを体験できたプロジェクトです。":
      "Adapting one design to several sizes taught me how important it is to think about the \"layout skeleton\" and the \"decoration\" separately. Extremely tall sizes like the skyscraper in particular don't work with ordinary layout thinking — I had to rearrange the information like building blocks. This project let me experience both the difficulty and the fun of designing to a format, close to real ad production.",
    "神戸北野水族館 Webデザイン":
      "Kobe Kitano Aquarium web design",
    "ミャンマー料理 動画サムネイル":
      "Myanmar food video thumbnail",
    // ---- work-business-card.html
    "パーソナル名刺デザイン | Thar Nyi Nyi":
      "Personal Business Card Design | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた「パーソナル名刺デザイン」。自分のロゴマークを使ったパーソナル名刺。チャコールとクリームの2色に、細い金茶のラインを効かせ、落ち着いた大人っぽい印象にまとめました。":
      "Case study: \"Personal Business Card Design\" by Thar Nyi Nyi. A personal business card using my own logo mark. Two colours, charcoal and cream, with a thin gold-brown line for a calm, grown-up impression.",
    "名刺（表・裏）・モックアップ":
      "Business card (front & back), mockups",
    "自分のロゴマークで伝える、落ち着いた「わたし」の名刺":
      "A calm business card that introduces \"me\" through my own logo mark",
    "パーソナル名刺 手帳と一緒のモックアップ":
      "Personal business card mockup with a notebook",
    "自分のロゴマーク（ターニニの頭文字を組み合わせた円形のマーク）を使って、学生としてのパーソナル名刺をデザインしました。表面には名前と連絡先、裏面にはロゴを大きく配置し、渡したときに名前とマークを一緒に覚えてもらえる構成にしています。":
      "I designed a personal business card as a student, using my own logo mark (a circular mark combining the initials of my name). The front holds my name and contact details, and the back shows the logo large, so people remember my name and mark together when I hand it over.",
    "表面はチャコールとクリームの2分割、裏面はチャコールの地にロゴを囲む斜めのラインを配置しました。":
      "The front is split into charcoal and cream; the back places diagonal lines around the logo on a charcoal ground.",
    "パーソナル名刺 表面":
      "Personal business card — front",
    "Front — 名前・連絡先":
      "Front — Name & contact",
    "パーソナル名刺 裏面":
      "Personal business card — back",
    "Back — ロゴマーク":
      "Back — Logo mark",
    "2色＋ライン":
      "Two colours + a line",
    "チャコールとクリームに、細い金茶のラインだけを足して、シンプルで上品な印象に。":
      "Just a thin gold-brown line added to charcoal and cream, for a simple, refined impression.",
    "ロゴを主役に":
      "The logo takes the lead",
    "裏面は斜めのラインでロゴへ視線が集まるように構成。":
      "On the back, diagonal lines draw the eye to the logo.",
    "情報の余白":
      "Room around the information",
    "表面はTEL・EMAIL・SNSのQRコードを小さなラベルで整理し、余白を広くとりました。":
      "On the front, TEL, EMAIL and the social QR code are organised with small labels, leaving generous whitespace.",
    "実際に使うシーンをイメージしたモックアップです。":
      "Mockups imagining the card in real use.",
    "パーソナル名刺 レザーケースと一緒のモックアップ":
      "Personal business card mockup with a leather case",
    // ---- work-can-badge.html
    "缶バッジデザイン — ようこそ KOBE | Thar Nyi Nyi":
      "Button Badge Design — Welcome KOBE | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた「缶バッジデザイン — ようこそ KOBE」。「ウェルカム（ようこそ）」をテーマにした缶バッジを2種類デザイン。神戸の街並みを描いた男性向けと、海の生きものキャラクターの女性向けで展開しました。":
      "Case study: \"Button Badge Design — Welcome KOBE\" by Thar Nyi Nyi. Two button badges on the theme of \"Welcome\": one for men featuring Kobe's cityscape, and one for women featuring sea-creature characters.",
    "缶バッジデザイン × 2":
      "Button badge designs × 2",
    "ウェルカム（ようこそ）— ターゲット別の2デザイン":
      "Welcome — two designs for two audiences",
    "ようこそ 缶バッジ 神戸（男性向け）と動物（女性向け）":
      "\"Welcome\" button badges — Kobe (for men) and animals (for women)",
    "「ウェルカム（ようこそ）」をテーマに、神戸を訪れた人を迎える缶バッジをデザインしました。同じテーマで、ターゲットの異なる2種類を制作しています。丸い小さな画面の中で、ひと目で「ようこそ」と「神戸」が伝わることを意識しました。":
      "On the theme of \"Welcome\", I designed button badges that greet people visiting Kobe — two versions of the same theme for different audiences. I made sure \"welcome\" and \"Kobe\" come across at a glance on a small round surface.",
    "神戸 — 男性向け":
      "Kobe — for men",
    "ネイビーの夜空に、ポートタワーや海洋博物館の並ぶ神戸の街並み。手前には波と緑の丘を重ね、海と山に囲まれた神戸らしさを表現しました。":
      "Kobe's cityscape, with Port Tower and the Maritime Museum, under a navy night sky. Waves and green hills in the foreground express Kobe, surrounded by sea and mountains.",
    "動物 — 女性向け":
      "Animals — for women",
    "ラベンダーから藍色へのグラデーションに、白い海の生きもののキャラクターと星。「ようこそ KOBE」の文字で、やさしく可愛い印象にまとめました。":
      "White sea-creature characters and stars on a lavender-to-indigo gradient. The words \"Welcome KOBE\" give it a gentle, cute impression.",
    "提出したデザインシートです。":
      "The design sheet I submitted.",
    "缶バッジのデザイン シート":
      "Button badge design sheet",
    // ---- work-choco-fes.html
    "チョコフェス KOBE — フライヤー | Thar Nyi Nyi":
      "Choco Fes KOBE — Flyer | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた「チョコフェス KOBE — フライヤー」。神戸のチョコレートイベント「チョコフェス KOBE」のA4フライヤー。とろけるチョコレートと神戸の街のイラストで、甘くて楽しいイベントの雰囲気を表現しました。":
      "Case study: \"Choco Fes KOBE — Flyer\" by Thar Nyi Nyi. An A4 flyer for \"Choco Fes KOBE\", a chocolate event in Kobe. Melting chocolate and illustrations of the city express the sweet, fun atmosphere of the event.",
    "イベントフライヤー（A4）":
      "Event flyer (A4)",
    "神戸のチョコレート大集合！— 見て、遊んで、味わって":
      "All of Kobe's chocolate in one place! — See it, play, taste it",
    "大丸神戸店のイベントホールで開催される架空のチョコレートイベント「チョコフェス KOBE」のフライヤーを制作しました。イベント名・日時・会場といった必要な情報をしっかり伝えつつ、見た瞬間に「甘くて楽しそう」と感じてもらえるビジュアルを目指しました。":
      "I created a flyer for \"Choco Fes KOBE\", a fictional chocolate event held in the event hall of Daimaru Kobe. While clearly communicating the necessary information — event name, date and venue — I aimed for a visual that makes people feel \"this looks sweet and fun\" the moment they see it.",
    "とろけるチョコレート":
      "Melting chocolate",
    "上下の角から垂れるチョコレートで、紙面全体を「チョコの世界」に。":
      "Chocolate dripping from the top and bottom corners turns the whole page into a \"world of chocolate\".",
    "神戸の街もとろける":
      "Even Kobe melts",
    "ポートタワーと海洋博物館を線画で描き、少し溶けたような表現で遊び心をプラス。":
      "Port Tower and the Maritime Museum drawn in line art, slightly melting, add a playful touch.",
    "情報の整理":
      "Organising the information",
    "リボンのキャッチコピー「見て、遊んで、味わって」の下に、日付・時間・会場を大きく配置しました。":
      "Under the ribbon tagline \"See it, play, taste it\", the date, time and venue are placed large.",
    // ---- work-hanabi.html
    "香住ふるさとまつり 海上花火大会 — ポスター | Thar Nyi Nyi":
      "Kasumi Hometown Festival Fireworks — Poster | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた「香住ふるさとまつり 海上花火大会 — ポスター」。「第49回 香住ふるさとまつり 海上花火大会」の告知ポスター（B2）。夜空いっぱいの花火と金色の筆文字で、夏祭りの高揚感を表現しました。":
      "Case study: \"Kasumi Hometown Festival Fireworks — Poster\" by Thar Nyi Nyi. A B2 poster announcing the \"49th Kasumi Hometown Festival Fireworks over the Sea\". Fireworks filling the night sky and golden brush lettering capture the excitement of a summer festival.",
    "告知ポスター（B2）":
      "Announcement poster (B2)",
    "夜空に咲く花火と、ふるさとの夏祭りの高揚感":
      "Fireworks blooming in the night sky, and the thrill of a hometown summer festival",
    "第49回 香住ふるさとまつり 海上花火大会 ポスター":
      "49th Kasumi Hometown Festival Fireworks over the Sea — poster",
    "兵庫県香美町の夏祭り「第49回 香住ふるさとまつり 海上花火大会」の告知ポスターを、B2サイズで制作しました。日時・会場・開催内容・お問い合わせ先といった多くの情報を載せながらも、遠くからでも「花火大会だ」と分かるインパクトを大切にしています。":
      "I created a B2 poster announcing the \"49th Kasumi Hometown Festival Fireworks over the Sea\", a summer festival in Kami, Hyogo. While carrying a lot of information — date, venue, programme and contact — I focused on an impact that says \"fireworks festival\" even from a distance.",
    "夜空いっぱいの花火":
      "Fireworks filling the night sky",
    "黒い夜空に広がる花火の写真を全面に使い、祭りの華やかさと迫力を表現。":
      "A full-bleed photo of fireworks spreading across a black night sky expresses the splendour and power of the festival.",
    "筆文字のタイトル":
      "Brush-lettered title",
    "「香住ふるさとまつり」を力強い筆文字で縦に大きく配置し、和の祭りらしさを演出。":
      "\"Kasumi Furusato Matsuri\" is set large and vertically in bold brush lettering, giving it the feel of a Japanese festival.",
    "金色のアクセント":
      "Gold accents",
    "「第49回」を囲む円や、「海上花火大会」の背景の筆跡を金色にして、夜空の中で目を引くポイントに。":
      "The circle around \"49th\" and the brushstroke behind \"Fireworks over the Sea\" are gold, drawing the eye in the night sky.",
    "情報エリア":
      "Information area",
    "下部に日時・会場・開催内容・お問い合わせ先を罫線で整理し、必要な情報をすぐ確認できるように。":
      "At the bottom, the date, venue, programme and contact are organised with rules so the essentials can be found at once.",
    // ---- work-hat-kobe.html
    "HAT神戸 — 縦型バナー | Thar Nyi Nyi":
      "HAT Kobe — Vertical Banner | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた「HAT神戸 — 縦型バナー」。神戸の街「HAT神戸」をPRする縦型バナー（500×1000mm）。人と街と海を線画でつなぎ、明るく爽やかな配色で街の魅力を伝えます。":
      "Case study: \"HAT Kobe — Vertical Banner\" by Thar Nyi Nyi. A vertical banner (500×1000 mm) promoting the HAT Kobe district. Line drawings connect people, city and sea, and a bright, fresh palette conveys the area's charm.",
    "縦型バナー（500 × 1000mm）":
      "Vertical banner (500 × 1000 mm)",
    "ハッと変貌し、だれもが幸福で、活気あふれる街へ。":
      "Transforming in a flash into a lively town where everyone is happy.",
    "神戸市の「HAT神戸（Happy Active Town）」をPRする、500×1000mmの縦型バナーをデザインしました。「ハッと変貌し、だれもが幸福で、活気あふれる街へ。」というメッセージを軸に、家族で暮らし、歩いて楽しめる街の雰囲気を伝えることを目指しています。":
      "I designed a 500×1000 mm vertical banner promoting \"HAT Kobe (Happy Active Town)\" in Kobe. Built around the message \"Transforming in a flash into a lively town where everyone is happy.\", it aims to convey the atmosphere of a town where families live and enjoy walking.",
    "ロゴタイプ":
      "Logotype",
    "「HAT」の3文字を緑・青・黄の3色で塗り分け、街の明るさと多様さを表現。":
      "The three letters of \"HAT\" in green, blue and yellow express the town's brightness and diversity.",
    "線画のイラスト":
      "Line illustrations",
    "手をつないで歩く家族、ビル、橋を細い線で描き、やさしく開放的な印象に。":
      "A family walking hand in hand, buildings and a bridge drawn in thin lines give a gentle, open impression.",
    "海と丘":
      "Sea and hills",
    "下半分には波と緑の丘を重ね、海に面した街の立地をひと目で分かるように。":
      "Waves and green hills layered in the lower half show at a glance that the town faces the sea.",
    // ---- work-kyudo.html
    "世界弓道大会 — World Kyudo Taikai | Thar Nyi Nyi":
      "World Kyudo Taikai | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた「第5回世界弓道大会」ロゴデザイン提案。ロゴ・A3ポスター・名刺までのビジュアルアイデンティティ展開。":
      "Case study: a logo design proposal for the \"5th World Kyudo Taikai\" by Thar Nyi Nyi — a visual identity extended to an A3 poster and business cards.",
    "ロゴ・A3ポスター・名刺（表・裏）・提案資料":
      "Logo, A3 poster, business card (front & back), proposal sheet",
    "射の一瞬を、文字に宿す。— 弓と矢を大会略称「5WKYT」に融合したロゴ":
      "Capturing the moment of the shot in the letters — a logo that merges bow and arrow into the abbreviation \"5WKYT\"",
    "第5回世界弓道大会 A3ポスター メインビジュアル":
      "5th World Kyudo Taikai A3 poster — main visual",
    "「第5回世界弓道大会（5th World Kyudo Taikai）」のロゴデザインを提案した課題です。大会略称「5WKYT」をもとにロゴマークを制作し、A3ポスター・名刺へと展開。コンセプトからカラー、ロゴバリエーション、使用イメージまでを1枚の提案資料にまとめました。":
      "An assignment to propose a logo for the \"5th World Kyudo Taikai\". I created a logo mark based on the abbreviation \"5WKYT\" and extended it to an A3 poster and business cards, summarising everything from the concept to colours, logo variations and usage images on a single proposal sheet.",
    "射の一瞬を、文字に宿す。":
      "Capturing the moment of the shot in the letters.",
    "弓道の「弓」と「矢」を、大会略称「5WKYT」の文字そのものに融合させました。Kの縦画を弓に見立て、番えた矢が文字列を貫く構成です。伝統的な競技らしさと現代的なすっきりした印象を両立させ、1色でも崩れない汎用性を意識しています。":
      "The \"bow\" and \"arrow\" of kyudo are merged into the letters of the abbreviation \"5WKYT\" themselves. The vertical stroke of the K becomes the bow, and the nocked arrow pierces through the letters. It balances the feel of a traditional sport with a clean, modern impression, and stays versatile even in a single colour.",
    "5WKYT ロゴマーク — 第5回世界弓道大会 WORLD KYUDO TAIKAI":
      "5WKYT logo mark — 5th World Kyudo Taikai",
    "3つのデザイン要素":
      "Three design elements",
    "弓の曲線":
      "The curve of the bow",
    "Kの縦画を弓に見立て、引き絞った弓の張りを表現。":
      "The vertical stroke of the K becomes a bow, expressing the tension of a fully drawn bow.",
    "矢の直線":
      "The line of the arrow",
    "文字列を一直線に貫く矢で、集中と方向性を表現。":
      "An arrow piercing straight through the letters expresses focus and direction.",
    "朱の筆致":
      "The vermilion brushstroke",
    "「5」に走る朱色の払いで、一射に込める気迫を表現。":
      "A vermilion stroke sweeping through the \"5\" expresses the spirit put into a single shot.",
    "和の伝統色を思わせる朱と墨を軸に、白と生成りを組み合わせた4色で構成しました。":
      "A four-colour palette built around vermilion and ink black, reminiscent of traditional Japanese colours, combined with white and unbleached off-white.",
    "朱 Shu":
      "Shu — Vermilion",
    "墨 Sumi":
      "Sumi — Ink black",
    "白 Shiro":
      "Shiro — White",
    "生成り Kinari":
      "Kinari — Off-white",
    "ロゴをA3ポスターと名刺に展開しました。ポスターでは弓を引く射手と朱の日の丸、桜と富士山を組み合わせ、国際大会としての「日本らしさ」を一目で伝える構成にしています。":
      "The logo was extended to an A3 poster and business cards. The poster combines an archer drawing the bow, a vermilion rising sun, cherry blossoms and Mt. Fuji, conveying the \"Japanese character\" of an international tournament at a glance.",
    "5WKYT 名刺 表面（黒地にロゴ）":
      "5WKYT business card — front (logo on black)",
    "5WKYT 名刺 裏面（氏名・連絡先）":
      "5WKYT business card — back (name and contact details)",
    "コンセプト・デザイン要素・カラー・ロゴバリエーション（シンボル／ロゴタイプ／横組み／縦組み／コンパクト）・使用イメージ（ポスター、名刺、のぼり旗、Tシャツ、トートバッグ）を1枚にまとめた提案資料です。":
      "A proposal sheet that brings together the concept, design elements, colours, logo variations (symbol / logotype / horizontal / vertical / compact) and usage images (poster, business card, banner flag, T-shirt, tote bag) on one page.",
    "世界弓道大会 ロゴデザイン提案資料":
      "World Kyudo Taikai logo design proposal sheet",
    "文字と競技のモチーフをどう1つのマークにまとめるかが一番の課題でした。弓と矢を別の要素として添えるのではなく、文字の一部として組み込むことで、シンプルでありながら弓道らしさが伝わるロゴになったと感じています。ポスターや名刺、グッズへ展開してみることで、ロゴがさまざまなサイズや背景色でも機能するかを確かめる大切さも学びました。":
      "The biggest challenge was combining the letters and the motif of the sport into one mark. By building the bow and arrow into the letters instead of adding them as separate elements, I feel the logo became simple yet clearly about kyudo. Applying it to the poster, business cards and goods also taught me the importance of checking that a logo works at different sizes and on different background colours.",
    // ---- work-portfolio-site.html
    "ポートフォリオサイト デザイン | Thar Nyi Nyi":
      "Portfolio Site Design | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた「ポートフォリオサイト デザイン」。自分の作品を紹介するポートフォリオサイトを、トップ・作品一覧・作品詳細・プロフィール・お問い合わせの全8ページでデザイン。ダークネイビー×オレンジで統一しました。":
      "Case study: \"Portfolio Site Design\" by Thar Nyi Nyi. A portfolio site to present my work, designed across 8 pages: top, works list, work details, profile and contact — unified in dark navy × orange.",
    "Website UI Design（全8ページ）":
      "Website UI Design (8 pages)",
    "作品が主役になる、ダークトーンのポートフォリオサイト":
      "A dark-toned portfolio site where the work takes centre stage",
    "ポートフォリオサイト トップページ デザイン フルページ":
      "Portfolio site top page design — full page",
    "スクロールしてページ全体を見る":
      "Scroll to see the whole page",
    "自分の制作実績を紹介するポートフォリオサイトを、全8ページ分デザインした課題です。トップページから作品一覧、作品ごとの詳細ページ、プロフィール、お問い合わせまで、サイト全体の導線とページ間の一貫性を意識して設計しました。":
      "An assignment to design an 8-page portfolio site presenting my work. From the top page to the works list, a detail page for each work, the profile and the contact page, I designed it with the navigation flow of the whole site and consistency between pages in mind.",
    "トップページ":
      "Top page",
    "名前とキャッチコピー、コードエディタ風のビジュアル、代表作のカードで第一印象をつくる入口。":
      "The entrance: name and tagline, a code-editor-style visual and cards of key works make the first impression.",
    "作品一覧":
      "Works list",
    "カテゴリで絞り込めるタブと、サムネイル付きの作品リスト。":
      "Category filter tabs and a list of works with thumbnails.",
    "作品詳細 × 4":
      "Work details × 4",
    "概要・課題・アプローチ・振り返りを同じテンプレートで構成し、関連作品へ回遊できるように。":
      "Overview, challenge, approach and reflection follow the same template, with links to related works to keep visitors exploring.",
    "プロフィール ／ お問い合わせ":
      "Profile / Contact",
    "経歴のタイムラインとスキル、シンプルなフォームでページを締めくくり。":
      "A timeline of my background, skills and a simple form to close the site.",
    "ダークネイビーの背景で作品のサムネイルを際立たせ、アクセントカラーのオレンジはボタンやラベルなど「次の行動」を促す要素だけに絞りました。全ページで同じヘッダー・フッター・見出しのスタイルを使い、どのページにいても同じサイトだと分かる統一感を大切にしています。":
      "The dark navy background makes the work thumbnails stand out, and the orange accent is reserved for elements that prompt the \"next action\", such as buttons and labels. Every page uses the same header, footer and heading styles, so it always feels like the same site wherever you are.",
    "各ページのデザインです。クリックするとページ全体の画像が開きます。":
      "The design of each page. Click to open the full-page image.",
    "ポートフォリオサイト 作品一覧 デザイン":
      "Portfolio site works list design",
    "ポートフォリオサイト 作品詳細 — アートと人 デザイン":
      "Portfolio site work detail — Art and Human design",
    "作品詳細 — アートと人":
      "Work detail — Art and Human",
    "ポートフォリオサイト 作品詳細 — バナー デザイン":
      "Portfolio site work detail — banner design",
    "作品詳細 — バナー":
      "Work detail — Banners",
    "ポートフォリオサイト 作品詳細 — 水族館 デザイン":
      "Portfolio site work detail — aquarium design",
    "作品詳細 — 水族館":
      "Work detail — Aquarium",
    "ポートフォリオサイト 作品詳細 — 料理動画 デザイン":
      "Portfolio site work detail — cooking video design",
    "作品詳細 — 料理動画":
      "Work detail — Cooking video",
    "ポートフォリオサイト プロフィール デザイン":
      "Portfolio site profile design",
    "プロフィール":
      "Profile",
    "ポートフォリオサイト お問い合わせ デザイン":
      "Portfolio site contact design",
    "お問い合わせ":
      "Contact",
    "FORNO ROSSO Webサイトデザイン":
      "FORNO ROSSO website design",
    // ---- work-poster.html
    "アートと人 — Art and Human | Thar Nyi Nyi":
      "Art and Human | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた展覧会ポスター「アートと人 / Art and Human」5つのコンセプト展開。":
      "Case study: the exhibition poster \"Art and Human\" by Thar Nyi Nyi, developed in five concepts.",
    "展覧会ポスター（5コンセプト展開）":
      "Exhibition posters (5 concepts)",
    "「アート」の正体を問い直す展覧会のためのビジュアル探求":
      "A visual exploration for an exhibition that asks what \"art\" really is",
    "アートと人 ポスターデザイン メインビジュアル":
      "Art and Human poster design — main visual",
    "神戸電子美術館で開催される架空の展覧会「アートと人 / Art and Human」のためのポスターを制作しました。同じテキスト・同じ日程情報を使いながら、5つのまったく異なるビジュアルコンセプトを展開し、1つのメッセージが表現次第でどれほど違う印象を持ちうるかを検証した課題です。":
      "I created posters for \"Art and Human\", a fictional exhibition held at the Kobe Denshi Museum of Art. Using the same text and schedule, I developed five completely different visual concepts — an assignment that tested how differently one message can come across depending on its expression.",
    "「アートとは何か」を問い直すという、抽象的で挑戦的なテーマをポスター1枚で伝えることが課題でした。単に美しいだけでなく、見る人に「立ち止まって考えさせる」強さを持たせつつ、日程・会場・主催情報といった実務的な要素も破綻なく収める必要がありました。":
      "The challenge was to convey an abstract, ambitious theme — asking \"what is art?\" — in a single poster. It had to be strong enough to make people \"stop and think\", not just beautiful, while fitting practical elements such as dates, venue and organiser without breaking the design.",
    "5つのコンセプト展開":
      "Five concepts",
    "同じ課題文に対して、まったく異なる5つの表現アプローチを試作しました。":
      "For the same brief, I prototyped five completely different approaches.",
    "Portrait — 人物の絵画的表現":
      "Portrait — A painterly figure",
    "暖色と寒色を対比させたデジタルペインティングの人物像で、感情的な深みを表現。":
      "A digitally painted figure contrasting warm and cool colours expresses emotional depth.",
    "Steampunk — 質感で魅せるタイポグラフィ":
      "Steampunk — Typography told through texture",
    "歯車や機械部品のテクスチャーを文字の中に閉じ込め、「人がつくるもの」としてのアートを暗示。":
      "Textures of gears and machine parts locked inside the letters hint at art as \"something people make\".",
    "Motion — 高コントラストな写真表現":
      "Motion — High-contrast photography",
    "粉塵をまとって踊るダンサーを黒背景×赤文字で切り取った、最もエディトリアルで力強いバージョン。":
      "A dancer wrapped in dust, framed in red type on black — the most editorial and powerful version.",
    "Fluid — 抽象的な質感表現":
      "Fluid — Abstract texture",
    "絵の具が流れるような抽象テクスチャーと縦組みタイポグラフィで、アートそのものの手触りを表現。":
      "Abstract textures like flowing paint and vertical typography express the very feel of art.",
    "Collage — グリッドとピクセルロゴ":
      "Collage — A grid and a pixel logo",
    "ピクセルアート風のロゴタイプと、彫刻・風船・壁画の3枚コラージュで、多様なアート表現を象徴。":
      "A pixel-art-style logotype and a three-image collage of sculpture, balloons and a mural symbolise the many forms of art.",
    "最終的に完成した5パターンのポスターです。同じ情報でも表現次第でまったく異なる印象になることが、並べてみるとよく分かります。":
      "The five finished posters. Placed side by side, it's clear how the same information can make a completely different impression depending on the expression.",
    "コンセプト01 — Portrait":
      "Concept 01 — Portrait",
    "コンセプト02 — Steampunk":
      "Concept 02 — Steampunk",
    "コンセプト03 — Motion":
      "Concept 03 — Motion",
    "コンセプト04 — Fluid":
      "Concept 04 — Fluid",
    "コンセプト05 — Collage":
      "Concept 05 — Collage",
    "1つの課題文に対して5通りの答えを出す経験を通して、デザインは「正解が1つではない」ことを強く実感しました。特に03のダンサーのビジュアルは、写真の力とタイポグラフィの組み方だけでここまで印象が変わるのかと、自分でも驚いた仕上がりです。次はこの中から1つを選び、ポスターだけでなくSNS用のバナーやチラシまで展開したビジュアルアイデンティティとして仕上げてみたいです。":
      "Giving five answers to one brief made me truly feel that design has \"no single right answer\". The dancer visual in 03 in particular surprised even me — how much the impression could change through the power of a photo and the way the type is set. Next, I'd like to pick one of them and finish it as a visual identity, extended beyond the poster to social media banners and flyers.",
    // ---- work-puffo.html
    "Puffo — 地元のPRキャラクター | Thar Nyi Nyi":
      "Puffo — A Local PR Character | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた「Puffo — 地元のPRキャラクター」。夏休み課題「地元のPRキャラを作ろう」で、ミャンマーをPRするキャラクター「Puffo」を考案。小さな願いを叶える雲の妖精として、プロフィールからグッズまで設計しました。":
      "Case study: \"Puffo — A Local PR Character\" by Thar Nyi Nyi. For the summer assignment \"Create a PR character for your hometown\", I created \"Puffo\", a character promoting Myanmar. A cloud fairy who grants small wishes — designed from profile to merchandise.",
    "キャラクターデザイン・プロフィール・グッズ（ボトル）":
      "Character design, profile, merchandise (bottle)",
    "小さな願いを叶える雲の妖精 — ミャンマーのPRキャラクター":
      "A cloud fairy who grants small wishes — a PR character for Myanmar",
    "クラス内の人気投票で第2位":
      "2nd place in a class popularity vote",
    "PRキャラクター Puffo とボトルのグッズデザイン":
      "PR character Puffo and bottle merchandise design",
    "1年生の夏休み課題「地元のPRキャラを作ろう」で制作したキャラクターです。自分の地元であるミャンマーをPRするキャラクターとして、ふわふわの雲の妖精「Puffo」を考えました。見た目だけでなく、性格や好きなものまで設定し、グッズへの展開もイメージしています。":
      "A character I created for the first-year summer assignment \"Create a PR character for your hometown\". To promote my hometown, Myanmar, I came up with \"Puffo\", a fluffy cloud fairy. I defined not only its look but also its personality and favourite things, and imagined it as merchandise.",
    "ミャンマー":
      "Myanmar",
    "星、夜空、空を飛ぶこと、人の笑顔、小さな願い":
      "Stars, the night sky, flying through the sky, people's smiles, small wishes",
    "小さな願いを叶える雲の妖精":
      "A cloud fairy who grants small wishes",
    "やさしくて、おだやかな性格。人の話を聞くことが好きで、大切な思い出を集めている。少し恥ずかしがり屋だけど、困っている人を見ると助けてくれる。星を見ることと、ふわふわ浮かぶことが好き。":
      "Gentle and calm. Loves listening to people and collects precious memories. A little shy, but always helps when someone is in trouble. Loves stargazing and floating softly.",
    "雲のシルエット":
      "Cloud silhouette",
    "もこもことした輪郭で、触りたくなるようなやわらかさを表現。":
      "A fluffy outline expresses a softness you want to touch.",
    "青い雲のアンテナ":
      "Blue cloud antenna",
    "頭の上の小さな雲がキャラクターのアイコンに。":
      "The little cloud on its head becomes the character's icon.",
    "星のブローチ":
      "Star brooch",
    "「小さな願い」の象徴として、首元のスカーフに黄色い星を。":
      "A yellow star on the scarf at its neck, as the symbol of \"small wishes\".",
    "課題として提出したキャラクターデザインシートです。ビジュアル・グッズデザインとプロフィールを1枚にまとめています。":
      "The character design sheet submitted for the assignment, combining the visuals, merchandise design and profile on one sheet.",
    // ---- work-self-intro.html
    "自己紹介サイト — Hello, I'm Thar Nyi Nyi | Thar Nyi Nyi":
      "Self-Introduction Site — Hello, I'm Thar Nyi Nyi | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた「自己紹介サイト — Hello, I'm Thar Nyi Nyi」。自分自身を紹介する1ページのWebサイト。ABOUT ME・好きなもの・思い出のマップを、クリーム×ブラック×ネオンの遊び心あるデザインでまとめました。":
      "Case study: \"Self-Introduction Site — Hello, I'm Thar Nyi Nyi\" by Thar Nyi Nyi. A one-page website that introduces me — About Me, my favourite things and a map of memories — in a playful cream × black × neon design.",
    "Webサイト（Figma → HTML / CSS・1ページ）":
      "Website (Figma → HTML / CSS, 1 page)",
    "「わたし」を4つの章で伝える、自己紹介のための1ページサイト":
      "A one-page site that introduces \"me\" in four chapters",
    "自己紹介サイト Webデザイン フルページ":
      "Self-introduction website design — full page",
    "自分自身をテーマにした自己紹介サイトのデザインです。プロフィールを並べるだけでなく、好きなものや、ミャンマーから日本へと続いてきた道のりを「章」に分けて見せることで、スクロールしながら人柄が伝わる構成を目指しました。":
      "A self-introduction website with myself as the theme. Rather than just listing my profile, it divides my favourite things and my journey from Myanmar to Japan into \"chapters\", so my personality comes across as you scroll.",
    "大きな名前のタイポグラフィと写真、SNSアイコンで第一印象をつくるヒーロー。":
      "A hero with big name typography, a photo and social icons to make the first impression.",
    "名前・出身・学校などの基本情報と、自己紹介文をノート風のカードで。":
      "Basic information — name, hometown, school — and a short introduction on notebook-style cards.",
    "旅行・アニメ・ゲーム・ラーメンなど、好きなものを写真タイルで紹介。":
      "Favourite things — travel, anime, games, ramen — shown as photo tiles.",
    "01 Myanmar → 02 Japan → 03 Travel Memories → 04 Future。点線のルートでつないだ、思い出と未来の地図。":
      "01 Myanmar → 02 Japan → 03 Travel Memories → 04 Future. A map of memories and the future, connected by a dotted route.",
    "クリーム色の紙のような背景に、黒の太いタイポグラフィとネオングリーン・パープルのアクセントを組み合わせ、スクラップブックのような手づくり感と元気さを表現しました。写真はポラロイド風に少し傾けて配置し、セクションごとに背景色を切り替えて章の区切りをはっきりさせています。":
      "A cream, paper-like background combined with bold black typography and neon green and purple accents gives it the handmade, cheerful feel of a scrapbook. Photos are tilted slightly like Polaroids, and the background colour changes per section to mark each chapter clearly.",
    // ---- work-video.html
    "ミャンマー料理動画 | Thar Nyi Nyi":
      "Myanmar Food Video | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけたミャンマー料理「チェーオー・シーチェッ」の紹介動画・サムネイルデザイン。":
      "Case study: a video introducing the Myanmar dish \"Kyay Oh Si Chat\" and its thumbnail design, by Thar Nyi Nyi.",
    "「チェーオー・シーチェッ」":
      "\"Kyay Oh Si Chat\"",
    "YouTube動画（5:13）＋サムネイルデザイン":
      "YouTube video (5:13) + thumbnail design",
    "ミャンマーの家庭料理を、日本の視聴者にもわかりやすく紹介する":
      "Introducing Myanmar home cooking in a way Japanese viewers can easily follow",
    "「【2026動画1】おうちで作れる！ミャンマー料理『チェーオー・シーチェッ』」というテーマで、ミャンマーの混ぜ麺料理「チェー・オー」の作り方を紹介するYouTube動画を制作しました。撮影した調理映像の編集に加えて、視聴者の目に留まるサムネイルデザインまで一貫して手がけています。":
      "On the theme \"[2026 Video 1] Make it at home! The Myanmar dish 'Kyay Oh Si Chat'\", I created a YouTube video showing how to make Kyay Oh, a Myanmar mixed-noodle dish. Beyond editing the cooking footage I filmed, I also designed an eye-catching thumbnail.",
    "日本ではまだあまり知られていないミャンマー料理を、初めて見る人にも「作ってみたい」と思ってもらえるように伝えることが課題でした。調理工程を分かりやすいテンポで見せつつ、料理名や手順が伝わるテロップを入れ、最後まで飽きずに見てもらえる編集を意識しました。":
      "The challenge was to present Myanmar food — still not well known in Japan — so that people seeing it for the first time would want to try making it. I showed the cooking steps at an easy-to-follow pace, added captions for the dish name and steps, and edited it so viewers would stay engaged to the end.",
    "撮影":
      "Filming",
    "実際にチェー・オーを調理する様子を、材料の下ごしらえから盛り付けまで撮影。":
      "Filmed the whole process of cooking Kyay Oh, from preparing the ingredients to plating.",
    "編集":
      "Editing",
    "不要なカットを削り、テンポよく見られるようカット編集。手順が伝わるようテロップを追加。":
      "Cut unnecessary footage and edited for a good pace. Added captions so the steps come across.",
    "色調補正":
      "Colour correction",
    "料理がより美味しそうに見えるよう、明るさと色味を調整。":
      "Adjusted brightness and colour so the food looks even more delicious.",
    "サムネイルデザイン":
      "Thumbnail design",
    "完成した料理写真に、目を引くタイトルロゴと「究極美味！」の煽り文をPhotoshopで加えてサムネイルを制作。":
      "Created the thumbnail in Photoshop, adding an eye-catching title logo and the tagline \"Ultimate deliciousness!\" to a photo of the finished dish.",
    "チェック柄のテーブルクロスを背景に、料理を中央に大きく配置。コミック風の太いタイトルロゴと「究極美味！」のバッジで、料理系動画らしいポップで美味しそうな印象に仕上げました。":
      "The dish sits large in the centre against a checked tablecloth. A bold, comic-style title logo and an \"Ultimate deliciousness!\" badge give it the poppy, delicious feel of a cooking video.",
    "ミャンマー料理動画 サムネイル ディテール":
      "Myanmar food video thumbnail — detail",
    "静止画のデザインと違い、動画編集は「時間」という軸をデザインする作業だと実感しました。テンポの良し悪しだけで、同じ映像でも伝わりやすさが大きく変わることを学びました。サムネイルは動画の「顔」として、静止画デザインのスキルがそのまま活きる部分でもあり、グラフィックデザインと動画編集をつなぐ良い経験になりました。":
      "Unlike still design, I realised that video editing is about designing along the axis of \"time\". I learned that the pace alone can greatly change how well the same footage communicates. The thumbnail, as the \"face\" of the video, is where still-design skills apply directly — a good experience connecting graphic design and video editing.",
    // ---- work-web-collection.html
    "制作事例：Thar Nyi Nyiが手がけた「Web Design Collection — 5 Brand Sites」。ピザ店・カフェ・和の茶房・ジム・タピオカ専門店。業種もトーンも異なる5つの架空ブランドのWebサイトを、それぞれの世界観に合わせてデザインしました。":
      "Case study: \"Web Design Collection — 5 Brand Sites\" by Thar Nyi Nyi. A pizzeria, a café, a Japanese tea house, a gym and a tapioca shop — websites for five fictional brands with different industries and tones, each designed to fit its own world.",
    "Website UI Design × 5（トップページ）":
      "Website UI Design × 5 (top pages)",
    "業種ごとに異なる「らしさ」を、配色・写真・タイポグラフィで描き分ける":
      "Expressing what makes each industry distinct through colour, photography and typography",
    "FORNO ROSSO ピザ店 Webサイトデザイン フルページ":
      "FORNO ROSSO pizzeria website design — full page",
    "業種もターゲットも異なる5つの架空ブランドについて、トップページのWebデザインを制作しました。同じ「トップページ」という枠組みでも、ブランドの性格によって配色・写真の使い方・文字組み・余白の取り方がどれだけ変わるのかを意識しながら、1サイトずつ世界観を作り分けています。":
      "I designed top pages for five fictional brands with different industries and target audiences. Within the same \"top page\" framework, I paid attention to how much the colours, use of photos, typesetting and whitespace change with the brand's personality, building a distinct world for each site.",
    "5つのブランド":
      "Five brands",
    "FORNO ROSSO — ピザ店":
      "FORNO ROSSO — Pizzeria",
    "「ピザで見つかる、おいしい時間。」赤とオレンジの暖色で、焼きたての熱気とシズル感を前面に。おすすめメニューをカードで並べました。":
      "\"Delicious moments, found in pizza.\" Warm reds and oranges bring out the heat and sizzle of freshly baked pizza, with recommended menu items laid out as cards.",
    "fiibi coffee — カフェ":
      "fiibi coffee — Café",
    "「一杯ぶんの、深呼吸。」ピーチベージュとブラウンの落ち着いた配色で、ハンドドリップの静かな時間を表現。":
      "\"A deep breath, one cup at a time.\" A calm palette of peach beige and brown expresses the quiet time of hand-drip coffee.",
    "一服 — 和の茶房":
      "Ippuku — Japanese tea house",
    "縦組みの見出しと余白を活かした和のレイアウト。茶・和菓子・季節（春夏秋冬）を写真で丁寧に見せています。":
      "A Japanese layout that makes use of vertical headings and whitespace, carefully showing tea, Japanese sweets and the four seasons through photos.",
    "FORGE — 24時間ジム":
      "FORGE — 24-hour gym",
    "「昨日の自分を、超えていけ」黒×ネオンイエローの強いコントラストと大きな欧文タイポで、力強さとスピード感を演出。":
      "\"Go beyond who you were yesterday.\" The strong black × neon yellow contrast and large Latin typography create a sense of power and speed.",
    "kumo boba — タピオカドリンク専門店":
      "kumo boba — Tapioca drink shop",
    "ラベンダーと雲のモチーフで、やわらかく可愛い世界観に。人気メニューや注文の3ステップを分かりやすく整理しました。":
      "Lavender and cloud motifs create a soft, cute world, with popular menu items and a 3-step ordering guide organised clearly.",
    "ハンドドリップのコーヒーショップ。写真の色味とUIの配色をそろえ、ページ全体を一杯のコーヒーのような温かいトーンでまとめました。":
      "A hand-drip coffee shop. The tones of the photos and the UI colours match, wrapping the whole page in a warm tone like a cup of coffee.",
    "fiibi coffee カフェ Webサイトデザイン フルページ":
      "fiibi coffee café website design — full page",
    "縦書きの見出し、和紙のような背景色、たっぷりとった余白で「ひと休み」の空気感を表現。季節ごとの和菓子を4つのタイルで紹介しています。":
      "Vertical headings, a washi-paper-like background and generous whitespace express the feeling of \"taking a break\". Seasonal Japanese sweets are introduced in four tiles.",
    "一服 和の茶房 Webサイトデザイン フルページ":
      "Ippuku Japanese tea house website design — full page",
    "黒ベースにネオンイエローを効かせ、流れる英字のテープや巨大な見出しで勢いを演出。プログラム紹介から料金プランまで、入会を後押しする構成にしました。":
      "Neon yellow on a black base, flowing tapes of English text and huge headings create momentum. From the programme overview to the price plans, the structure encourages visitors to sign up.",
    "FORGE 24時間ジム Webサイトデザイン フルページ":
      "FORGE 24-hour gym website design — full page",
    "ラベンダー × ネイビーの配色と雲のシルエットで、ブランド名「kumo（雲）」をそのままビジュアルに。メニューカードやステップ表示も丸みのある形で統一しています。":
      "A lavender × navy palette and cloud silhouettes turn the brand name \"kumo\" (cloud) straight into visuals. Menu cards and step indicators are unified with rounded shapes.",
    "kumo boba タピオカドリンク専門店 Webサイトデザイン フルページ":
      "kumo boba tapioca drink shop website design — full page",
    // ---- work-website.html
    "制作事例：Thar Nyi Nyiがデザインした水族館サイト「神戸北野水族館」のWebデザイン。":
      "Case study: web design for the aquarium site \"Kobe Kitano Aquarium\" by Thar Nyi Nyi.",
    "Website UI Design（Figmaモックアップ）":
      "Website UI Design (Figma mockup)",
    "幻想的な海中体験を伝える、水族館の公式サイト":
      "An official aquarium website that conveys a dreamy underwater experience",
    "神戸北野水族館 Webサイトデザイン フルページ":
      "Kobe Kitano Aquarium website design — full page",
    "架空の水族館「神戸北野水族館」の公式サイトを、企画からビジュアルデザインまで一貫してFigmaで制作しました。トップページ1枚に、チケット購入・最新ニュース・展示エリア紹介・営業時間とアクセスまでを詰め込んだ、情報量の多い縦長のレイアウトです。観光施設サイトとして「見て楽しい」ことと「必要な情報がすぐ見つかる」ことを両立させることを目指しました。":
      "I created the official website for the fictional \"Kobe Kitano Aquarium\" in Figma, from planning through visual design. It's a long, information-rich layout that fits ticket purchase, the latest news, exhibit areas, opening hours and access into a single top page. As a website for a tourist attraction, I aimed for it to be both \"fun to look at\" and \"quick to find what you need\".",
    "水族館サイトには、幻想的で没入感のあるビジュアルが求められる一方で、チケット料金や営業時間、アクセスといった実用的な情報を来館前にすぐ確認したいというニーズもあります。「雰囲気」と「機能性」という相反する要素を、1つの縦長ページの中でどうバランスよく配置するかが今回の一番の課題でした。":
      "An aquarium website needs dreamy, immersive visuals, but visitors also want to check practical information — ticket prices, opening hours, access — before they come. The biggest challenge was balancing these opposing elements, \"atmosphere\" and \"function\", within one long page.",
    "ページは「ヒーロー（訴求）→最新情報→チケット購入→展示エリア紹介→営業時間・アクセス」という、来館検討者の意思決定の流れに沿った順番で構成しました。各セクションは半透明のガラス風カード（グラスモーフィズム）で統一し、写真の上に情報を重ねても文字が読みやすいように設計しています。":
      "The page follows the decision-making flow of a potential visitor: \"Hero (appeal) → Latest news → Ticket purchase → Exhibit areas → Opening hours & access\". Every section uses the same semi-transparent glass-like cards (glassmorphism), designed so that text stays readable even when layered over photos.",
    "Hero — 海の神秘を探索しよう":
      "Hero — Explore the mysteries of the sea",
    "大型のサメ・魚群の写真を背景に、キャッチコピーと2つのCTAボタン、営業時間・アクセス・入館料の3つの情報チップを配置。":
      "A large photo of sharks and schools of fish in the background, with a tagline, two CTA buttons and three info chips: opening hours, access and admission.",
    "新規展示やレストランリニューアルなどのお知らせを、カードカルーセル形式で表示。":
      "News such as new exhibits and the restaurant renewal, shown as a card carousel.",
    "チケット情報":
      "Ticket information",
    "入場券・年間パスポートの料金表と、購入導線となるCTAボタンを分かりやすく整理。":
      "Price tables for admission and annual passes, clearly organised with a CTA button leading to purchase.",
    "展示・エリア紹介 ／ 営業時間＆アクセス":
      "Exhibit areas / Opening hours & access",
    "「深海の世界」「サンゴの楽園」「北の海」の3エリアを写真カードで紹介し、最後に営業時間の季節変動と地図を掲載。":
      "Three areas — \"Deep Sea World\", \"Coral Paradise\" and \"Northern Seas\" — introduced with photo cards, followed by seasonal opening hours and a map.",
    "ページ全体を深海をイメージした紺色〜ブルーのグラデーションで統一し、白いUIカードとテキストで視認性を確保。気泡や光を思わせるライトブルーのアクセントで、静かで幻想的な海中の空気感を表現しました。":
      "The whole page uses a navy-to-blue gradient inspired by the deep sea, with white UI cards and text for legibility. Light-blue accents that suggest bubbles and light express a quiet, dreamy underwater atmosphere.",
    "見出しには太めのゴシック体を使用し、暗い背景の上でも視認性の高い強いコントラストを確保。本文や料金表などの情報部分は、読みやすさを優先したシンプルなサンセリフ体でまとめています。":
      "Headings use a bold gothic typeface for strong contrast and high legibility on the dark background. Information such as body text and price tables uses a simple sans-serif that puts readability first.",
    "完成したデザインは、ヒーローセクションの没入感あるビジュアルから、実用的なチケット情報・アクセス情報まで、1本のスクロールで無理なく体験できる構成になりました。ガラス風カードのおかげで、写真主体のセクションでも情報がしっかり読み取れます。ページ全体は、上部の「Kobe Kitano Aquarium」のブラウザプレビューからスクロールしてご覧いただけます。":
      "The finished design lets visitors move naturally in a single scroll, from the immersive hero visuals to practical ticket and access information. Thanks to the glass-like cards, information stays easy to read even in photo-heavy sections. You can scroll through the whole page in the \"Kobe Kitano Aquarium\" browser preview above.",
    "1枚の縦長ページの中に多くの情報を詰め込みながらも、セクションごとの役割をはっきり分けることの大切さを学びました。特にグラスモーフィズムのカードは、写真の上に文字を重ねても読みやすさを保てる有効な手法だと実感しています。次はこのデザインを実際にHTML・CSSでコーディングし、レスポンシブ対応のライブサイトとして仕上げてみたいです。":
      "I learned how important it is to give each section a clear role, even while fitting a lot of information into one long page. I found glassmorphism cards especially effective for keeping text readable over photos. Next, I'd like to code this design in HTML and CSS and finish it as a responsive live site.",
    // ---- work-zine.html
    "ミャンマーの一口 — A Bite of Myanmar | Thar Nyi Nyi":
      "A Bite of Myanmar | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた「ミャンマーの一口 — A Bite of Myanmar」。ミャンマーと日本の料理を見開きごとに比べながら紹介する、全12ページのZINE。テラコッタと藍色の2色で、ふたつの国の食文化をつなぎました。":
      "Case study: \"A Bite of Myanmar\" by Thar Nyi Nyi. A 12-page ZINE that introduces Myanmar and Japanese dishes side by side on each spread. Two colours, terracotta and indigo, connect the food cultures of the two countries.",
    "ZINE（B5・全12ページ）／ プレゼンテーション資料":
      "ZINE (B5, 12 pages) / presentation slides",
    "ちがう味、つながる文化。— 食べ物を通して、ミャンマーと日本の文化を知る":
      "Different flavours, connected cultures — getting to know Myanmar and Japan through food",
    "学内作品展の展示作品に選出":
      "Selected for the school exhibition",
    "ZINE ミャンマーの一口 A Bite of Myanmar 表紙":
      "ZINE \"A Bite of Myanmar\" cover",
    "ミャンマーの代表的な料理と、日本の料理を比べながら紹介するZINE「ミャンマーの一口 — A Bite of Myanmar」を企画・デザインしました。食を通して、ふたつの国の共通点や違いを知り、ミャンマーの文化に興味を持ってもらうことを目的にしています。":
      "I planned and designed \"A Bite of Myanmar\", a ZINE that introduces signature Myanmar dishes alongside Japanese dishes. The aim is to discover what the two countries share and how they differ through food, and to spark interest in Myanmar culture.",
    "ターゲットは、ミャンマーの料理や文化をあまり知らない日本人と、日本に住んでいるミャンマー人。食べ物を通して、お互いの文化を知るきっかけをつくることを目指しました。ZINEとあわせて、企画意図を伝えるプレゼンテーション資料も制作しています。":
      "The audience is Japanese people who don't know much about Myanmar food and culture, and Myanmar people living in Japan. I aimed to create an opportunity to learn about each other's culture through food. Alongside the ZINE, I also made presentation slides explaining the concept.",
    "ミャンマーの料理と日本の料理が交互に登場する構成です。ミャンマーのページはテラコッタ、日本のページは藍色と、国ごとに色を分けることで、めくるたびに2つの国を行き来する感覚をつくりました。":
      "Myanmar and Japanese dishes appear in turn. Myanmar pages are terracotta and Japanese pages are indigo — separating the countries by colour creates the feeling of travelling between them with every page turn.",
    "Myanmar — テラコッタ":
      "Myanmar — Terracotta",
    "モヒンガー、シャンヌードル、モンリンマヤー、ラペットゥ。パゴダや伝統文様のモチーフを添えて。":
      "Mohinga, Shan noodles, Mont Lin Ma Yar and Lahpet (tea-leaf salad) — with motifs of pagodas and traditional patterns.",
    "Japan — 藍色":
      "Japan — Indigo",
    "ラーメン、まぜそば、たこ焼き。富士山や青海波のモチーフで日本らしさを表現。":
      "Ramen, mazesoba and takoyaki — with motifs such as Mt. Fuji and seigaiha waves to express Japan.",
    "料理を比べる":
      "Comparing dishes",
    "モヒンガー × ラーメン、シャンヌードル × まぜそば。ミャンマーと日本の料理を組み合わせて並べ、それぞれの違いや共通点を発見できるように。":
      "Mohinga × ramen, Shan noodles × mazesoba. Myanmar and Japanese dishes are paired side by side so you can discover their differences and similarities.",
    "共通のレイアウト":
      "A shared layout",
    "料理名（日本語・英語）・写真・説明文・Origin・Tasteを全ページ同じ位置に配置し、比べやすく。":
      "Dish name (Japanese and English), photo, description, origin and taste sit in the same place on every page, making them easy to compare.",
    "表紙から奥付までの全12ページです。":
      "All 12 pages, from the cover to the colophon.",
    "表紙":
      "Cover",
    "ZINE ミャンマーの一口 目次":
      "ZINE \"A Bite of Myanmar\" — contents",
    "目次":
      "Contents",
    "ZINE ミャンマーの一口 01 はじめに":
      "ZINE \"A Bite of Myanmar\" — 01 Introduction",
    "01 はじめに":
      "01 Introduction",
    "ZINE ミャンマーの一口 02 モヒンガー":
      "ZINE \"A Bite of Myanmar\" — 02 Mohinga",
    "02 モヒンガー":
      "02 Mohinga",
    "ZINE ミャンマーの一口 03 ラーメン":
      "ZINE \"A Bite of Myanmar\" — 03 Ramen",
    "03 ラーメン":
      "03 Ramen",
    "ZINE ミャンマーの一口 04 シャンヌードル":
      "ZINE \"A Bite of Myanmar\" — 04 Shan noodles",
    "04 シャンヌードル":
      "04 Shan noodles",
    "ZINE ミャンマーの一口 05 まぜそば":
      "ZINE \"A Bite of Myanmar\" — 05 Mazesoba",
    "05 まぜそば":
      "05 Mazesoba",
    "ZINE ミャンマーの一口 06 モンリンマヤー":
      "ZINE \"A Bite of Myanmar\" — 06 Mont Lin Ma Yar",
    "06 モンリンマヤー":
      "06 Mont Lin Ma Yar",
    "ZINE ミャンマーの一口 07 たこ焼き":
      "ZINE \"A Bite of Myanmar\" — 07 Takoyaki",
    "07 たこ焼き":
      "07 Takoyaki",
    "ZINE ミャンマーの一口 08 ラペットゥ":
      "ZINE \"A Bite of Myanmar\" — 08 Lahpet (tea-leaf salad)",
    "08 ラペットゥ":
      "08 Lahpet — Tea-Leaf Salad",
    "ZINE ミャンマーの一口 ミャンマー × 日本":
      "ZINE \"A Bite of Myanmar\" — Myanmar × Japan",
    "ミャンマー × 日本":
      "Myanmar × Japan",
    "ZINE ミャンマーの一口 裏表紙・奥付":
      "ZINE \"A Bite of Myanmar\" — back cover & colophon",
    "裏表紙・奥付":
      "Back cover & colophon",
    "ページの片側を大きくうねる色面で区切り、写真と文字の余白を広くとることで、情報量が多くても落ち着いて読める誌面にしました。表紙と裏表紙ではパゴダ・富士山・青海波などのイラストを組み合わせ、「食べ物は、記憶をつなぐ、やさしい橋。」というメッセージで全体を締めくくっています。":
      "One side of each page is divided by a large, flowing colour field, and generous space around photos and text keeps the pages calm to read even with a lot of information. The front and back covers combine illustrations of pagodas, Mt. Fuji and seigaiha waves, and the whole ZINE closes with the message \"Food is a gentle bridge that connects memories.\"",
    "特にこだわったところ — ラペットゥのページ":
      "Where I put in extra care — the Lahpet (tea-leaf salad) page",
    "ミャンマーでしか出会えない「食べるお茶」ラペットゥは、日本料理と無理に比較せず、ミャンマーならではの料理として紹介しました。他の料理ページとは違う見せ方にして、ラペットゥの特別さが伝わるように工夫し、ミャンマーの食文化をより深く知ってもらえるページにしています。":
      "Lahpet, Myanmar's distinctive fermented tea-leaf salad, is introduced as a dish in its own right rather than being forced into a comparison with Japanese food. I gave it a different presentation from the other dishes to highlight what makes it special and help readers learn more about Myanmar's food culture.",
    "ZINE ミャンマーの一口 08 ラペットゥのページ":
      "ZINE \"A Bite of Myanmar\" — 08 Lahpet (tea-leaf salad) page",
    "制作の中で一番の挑戦は、どのミャンマー料理と日本料理を組み合わせるかを考えることでした。実際に料理を比較してみると、食べ物だけでなく、文化の違いや共通点も伝えやすくなることを発見しました。食べ物から、お互いの文化を知る — そのきっかけになるZINEを目指しました。":
      "The biggest challenge was deciding which Myanmar and Japanese dishes to pair. When I actually compared the dishes, I found it became easier to convey not just the food but also cultural differences and similarities. Getting to know each other's culture through food — I aimed for a ZINE that sparks exactly that.",
    // ---- work-zodiac.html
    "12星座キャラクター — Zodiac Koalas | Thar Nyi Nyi":
      "Zodiac Koalas — 12 Zodiac Characters | Thar Nyi Nyi",
    "制作事例：Thar Nyi Nyiが手がけた「12星座キャラクター — Zodiac Koalas」。コアラをベースに、12星座それぞれのモチーフを組み合わせたキャラクターシリーズ。夜空の背景と共通のフォーマットで、12枚をひとつのシリーズにまとめました。":
      "Case study: \"Zodiac Koalas — 12 Zodiac Characters\" by Thar Nyi Nyi. A character series based on a koala, combined with a motif for each of the 12 zodiac signs. A night-sky background and a shared format bring all 12 together as one series.",
    "キャラクターイラスト × 12（56mm角）・パッケージ（表・裏）・ポスター":
      "Character illustrations × 12 (56 mm square), package (front & back), poster",
    "1匹のコアラが、12の星座に変身する":
      "One koala transforms into 12 zodiac signs",
    "12星座をテーマにしたキャラクターシリーズです。同じコアラのキャラクターをベースに、星座ごとのモチーフ（角・たてがみ・はさみ・天秤など）を身につけさせることで、12種類のバリエーションを展開しました。":
      "A character series themed on the 12 zodiac signs. Based on the same koala character, each sign wears its own motif — horns, a mane, claws, scales and so on — creating 12 variations.",
    "共通のフォーマット":
      "A shared format",
    "紫の夜空・月・星・雲の背景と、星座名のレイアウトを全12枚で統一し、並べたときにシリーズとして見えるように。":
      "The purple night sky, moon, stars and clouds in the background and the layout of the sign name are the same on all 12, so they read as one series when placed together.",
    "コアラ × 星座モチーフ":
      "Koala × zodiac motif",
    "おひつじ座には巻き角、かに座にはカニの帽子、しし座にはたてがみ、いて座には弓矢の帽子など、ひと目で分かるモチーフを1つだけ足すルールに。":
      "Curled horns for Aries, a crab hat for Cancer, a mane for Leo, a bow-and-arrow hat for Sagittarius — the rule is to add just one motif that's recognisable at a glance.",
    "シンプルな形":
      "Simple shapes",
    "小さいサイズでも認識できるよう、丸みのある形と少ない色数で描いています。":
      "Drawn with rounded shapes and few colours so they're recognisable even at small sizes.",
    "おひつじ座からうお座まで、12星座すべてのキャラクターです。":
      "All 12 zodiac characters, from Aries to Pisces.",
    "おひつじ座 — Aries":
      "Aries",
    "おうし座 — Taurus":
      "Taurus",
    "ふたご座 — Gemini":
      "Gemini",
    "かに座 — Cancer":
      "Cancer",
    "しし座 — Leo":
      "Leo",
    "おとめ座 — Virgo":
      "Virgo",
    "12星座キャラクター てんびん座 — Libra":
      "Zodiac character — Libra",
    "てんびん座 — Libra":
      "Libra",
    "12星座キャラクター さそり座 — Scorpio":
      "Zodiac character — Scorpio",
    "さそり座 — Scorpio":
      "Scorpio",
    "12星座キャラクター いて座 — Sagittarius":
      "Zodiac character — Sagittarius",
    "いて座 — Sagittarius":
      "Sagittarius",
    "12星座キャラクター やぎ座 — Capricorn":
      "Zodiac character — Capricorn",
    "やぎ座 — Capricorn":
      "Capricorn",
    "12星座キャラクター みずがめ座 — Aquarius":
      "Zodiac character — Aquarius",
    "みずがめ座 — Aquarius":
      "Aquarius",
    "12星座キャラクター うお座 — Pisces":
      "Zodiac character — Pisces",
    "うお座 — Pisces":
      "Pisces",
    "キャラクターシリーズを「星座シールコレクション（全12種・シール1枚入り）」という商品として展開し、パッケージの表・裏とポスターをデザインしました。パッケージはキャラクターと同じ夜空の世界観でまとめ、裏面には全12種を一覧で並べています。ポスターは「12の星が、ひとつの世界になる。」をコピーに、12星座が星の軌道に沿ってつながる構成にしました。":
      "I developed the character series into a product, a \"Zodiac Sticker Collection (12 types, 1 sticker per pack)\", and designed the front and back of the package and a poster. The package shares the characters' night-sky world, and the back lists all 12 types. The poster uses the copy \"12 stars become one world.\", with the 12 signs connected along a starry orbit.",
    "星座シールコレクション パッケージ 表面":
      "Zodiac Sticker Collection package — front",
    "星座シールコレクション パッケージ 裏面（全12種の一覧）":
      "Zodiac Sticker Collection package — back (list of all 12 types)",
    "星座シールコレクション ポスター — 12の星が、ひとつの世界になる。":
      "Zodiac Sticker Collection poster — 12 stars become one world.",
    // ---- text written by JavaScript
    // js/motion.js — the ID card's screen-reader label
    "（ドラッグ、または矢印キーで動かせます）":
      " (drag it, or move it with the arrow keys)",
    // js/main.js — contact form
    "送信中です…":
      "Sending…",
    "送信しました。お問い合わせありがとうございます！内容を確認して、ご返信いたします。":
      "Sent! Thank you for your message — I'll read it and get back to you.",
    "送信できませんでした。お手数ですが tharnyinyi959@gmail.com まで直接メールでご連絡ください。":
      "Your message couldn't be sent. Sorry for the trouble — please email me directly at tharnyinyi959@gmail.com.",
    // hero/coding-hero.js, loading/loading.js — decorative lines
    "コードで、つくる。":
      "Made with code.",
    "ウェブを、つくる。":
      "Building the web.",
  };

  const KEY = "portfolio-lang";
  let lang = "ja";
  try { if (localStorage.getItem(KEY) === "en") lang = "en"; } catch (e) { }
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const en = (s) => EN[norm(s)];
  // for scripts that write text themselves: I18N.t("日本語") returns the English when EN is on
  window.I18N = { lang, t: (s) => (lang === "en" && en(s)) || s };
  const root = document.documentElement;
  root.setAttribute("data-lang", lang);

  if (lang === "en") {
    root.lang = "en";
    const JP = /[぀-ヿ㐀-鿿！-｠]/;
    const ATTRS = ["alt", "aria-label", "placeholder", "title"];
    const text = (n) => {
      const v = n.nodeValue, e = JP.test(v) && en(v);
      if (e) n.nodeValue = v.match(/^\s*/)[0] + e + v.match(/\s*$/)[0];     // keep the spacing around it
    };
    const attrs = (el) => ATTRS.forEach((a) => {
      const v = el.getAttribute(a), e = v && JP.test(v) && en(v);
      if (e) el.setAttribute(a, e);
    });
    const skip = { acceptNode: (n) => (n.nodeType === 1 && /^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) };
    const walk = (node) => {
      if (node.nodeType === 3) return text(node);
      if (node.nodeType !== 1 || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(node.tagName)) return;
      attrs(node);
      const w = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, skip);
      while (w.nextNode()) (w.currentNode.nodeType === 3 ? text : attrs)(w.currentNode);
    };
    document.title = en(document.title) || document.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && en(desc.content)) desc.content = en(desc.content);
    walk(document.body);
    // parts added later by scripts (the coding hero, the opening screen)
    new MutationObserver((list) => list.forEach((m) => m.addedNodes.forEach(walk))).observe(document.body, { childList: true, subtree: true });
  }

  // the switch: remember the choice and reload the page in that language
  document.querySelectorAll(".lang-switch [data-lang]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    b.addEventListener("click", () => {
      if (b.dataset.lang === lang) return;
      try { localStorage.setItem(KEY, b.dataset.lang); } catch (e) { }
      location.replace(location.href);
    });
  });
})();
