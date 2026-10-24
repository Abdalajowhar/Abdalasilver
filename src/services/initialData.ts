import { Course, User, CourseReview, DiscountCode, Announcement } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-cadka',
    name: 'Abdala Silver (Admin)',
    email: 'cadkajwhr5@gmail.com',
    role: 'admin',
    avatar: '/src/assets/images/abdala_hero_studio_1792842639594.jpg',
    bio: 'Founder & Super Administrator of Abdala Silver Creative Academy.',
    preferredLanguage: 'so',
    joinedDate: '2024-01-01',
    enrolledCourseIds: ['course-1', 'course-2', 'course-3', 'course-4', 'course-5', 'course-6'],
    wishlistCourseIds: [],
    completedCourseIds: ['course-1', 'course-6'],
  },
  {
    id: 'user-admin',
    name: 'Abdala Silver',
    email: 'admin@abdalasilver.com',
    role: 'admin',
    avatar: '/src/assets/images/abdala_hero_studio_1792842639594.jpg',
    bio: 'Founder of Abdala Silver Creative Academy. Commercial filmmaker, video editor & digital educator.',
    preferredLanguage: 'en',
    joinedDate: '2024-01-10',
    enrolledCourseIds: ['course-1', 'course-4'],
    wishlistCourseIds: [],
    completedCourseIds: ['course-1'],
  },
  {
    id: 'user-instructor',
    name: 'Hamza Ali',
    email: 'instructor@abdalasilver.com',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Senior Motion Designer & VFX Artist with 8+ years experience in 3D typography and After Effects.',
    preferredLanguage: 'so',
    joinedDate: '2024-03-15',
    enrolledCourseIds: ['course-3'],
    wishlistCourseIds: [],
    completedCourseIds: [],
  },
  {
    id: 'user-student',
    name: 'Fatima Warsame',
    email: 'student@abdalasilver.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    bio: 'Aspiring freelance video editor and content creator based in Mogadishu.',
    preferredLanguage: 'so',
    joinedDate: '2024-08-01',
    enrolledCourseIds: ['course-1', 'course-6'],
    wishlistCourseIds: ['course-2', 'course-5'],
    completedCourseIds: ['course-6'],
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'DaVinci Resolve & Premiere Pro: Cinematic Color Grading & Narrative Editing',
    titleSo: 'DaVinci Resolve & Premiere Pro: Habeynta Midabada & Isku-dubbaridka Filimada',
    slug: 'davinci-premiere-cinematic-masterclass',
    tagline: 'Transform raw camera footage into high-end cinema and commercial grade visuals.',
    taglineSo: 'U beddel muuqaallada caadiga ah kuwo heer filim iyo xayeysiis caalami ah.',
    description: 'A comprehensive, project-driven masterclass taking you from basic cuts to Hollywood-level color correction, node grading in DaVinci Resolve, sound mixing, and export optimization. Taught directly with raw 4K RED and Blackmagic camera footage.',
    descriptionSo: 'Koorso dhamaystiran oo kugu baraysa jarista xirfadeed ee Premiere Pro, dhisidda nodes-ka DaVinci Resolve, sixidda midabada (Color Grading), iyo habeeynta codka iyadoo la adeegsanayo muuqaallo 4K ah oo dhab ah.',
    category: 'video-editing',
    level: 'Intermediate',
    instructorId: 'user-admin',
    instructorName: 'Abdala Silver',
    instructorTitle: 'Digital Media Director & Colorist',
    instructorAvatar: '/src/assets/images/abdala_hero_studio_1792842639594.jpg',
    thumbnail: '/src/assets/images/course_video_edit_1792842654103.jpg',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '14h 45m',
    totalLessons: 12,
    price: 49,
    currency: 'USD',
    isPublished: true,
    isFeatured: true,
    language: 'Bilingual',
    enrollmentCount: 1420,
    rating: 4.9,
    createdAt: '2024-05-12',
    updatedAt: '2024-10-15',
    prerequisites: [
      'Basic computer literacy (Mac or Windows)',
      'DaVinci Resolve Free or Studio installed',
      'Adobe Premiere Pro (optional but recommended)'
    ],
    whatYouWillLearn: [
      'Master the 3-point editing workflow and dynamic timeline trimming',
      'Color space management (ACES, DaVinci YRGB Color Managed)',
      'Primary color wheels, curves, qualifiers, and power windows',
      'Creating signature cinematic teal & orange and moody film looks',
      'Fairlight audio sweetening, dialogue cleanup, and loudness standards'
    ],
    whatYouWillLearnSo: [
      'Baro farsamada jarista xawaaraha sare leh ee timeline-ka',
      'Maamulka Color Space-ka casriga ah (ACES & DaVinci YRGB)',
      'Isticmaalka Color Wheels, Curves, Qualifiers, iyo Power Windows',
      'Abuurista midabada filimada caanka ah sida Teal & Orange',
      'Hagaajinta iyo nadiifinta codka (Dialogue Cleanup & Audio Mastering)'
    ],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: The Narrative Cut & Timeline Architecture',
        titleSo: 'Qeybta 1: Habka Jarista Sheekada & Dhismaha Timeline-ka',
        order: 1,
        lessons: [
          {
            id: 'les-1-1',
            title: 'Welcome & Course Project Footage Overview',
            titleSo: 'Hordhac & Dulmar ku Saabsan Muuqaallada Mashruuca',
            duration: '09:20',
            durationSeconds: 560,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            isPreview: true,
            description: 'Introduction to Abdala Silver’s editing philosophy, project file structure, and downloading the 4K raw practice footage.',
            descriptionSo: 'Falsafada wax-is-weydaarsiga muuqaalka ee Abdala Silver iyo soo dejinta faylasha 4K ee tababarka.',
            order: 1,
            resources: [
              {
                id: 'res-1',
                title: 'Raw 4K Practice Clip Pack (1.2 GB)',
                type: 'zip',
                fileSize: '1.2 GB',
                url: 'https://abdalasilver.com/downloads/practice_pack_01.zip'
              },
              {
                id: 'res-2',
                title: 'Editing Keyboard Shortcuts Cheat Sheet (PDF)',
                type: 'pdf',
                fileSize: '2.4 MB',
                url: 'https://abdalasilver.com/downloads/shortcuts_cheatsheet.pdf'
              }
            ]
          },
          {
            id: 'les-1-2',
            title: 'J-Cuts, L-Cuts, and Emotional Pacing in Premiere Pro',
            titleSo: 'Isticmaalka J-Cuts, L-Cuts, iyo Xawaaraha Qiiro-gelinta leh',
            duration: '18:40',
            durationSeconds: 1120,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPreview: true,
            description: 'How to cut dialogue seamlessly so the audience forgets they are watching an edited video.',
            descriptionSo: 'Sida loo jaro hadallada iyadoo aan la dareemayn kala goynta muuqaalka.',
            order: 2,
            resources: [
              {
                id: 'res-3',
                title: 'Dialogue Cutting Project Sequence (.prproj)',
                type: 'preset',
                fileSize: '15 MB',
                url: 'https://abdalasilver.com/downloads/dialogue_sequence.zip'
              }
            ]
          },
          {
            id: 'les-1-3',
            title: 'B-Roll Rhythm and Sound Effect Layering',
            titleSo: 'Isku-habeynta B-Roll-ka iyo Saamaynta Codadka (SFX)',
            duration: '22:15',
            durationSeconds: 1335,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            isPreview: false,
            description: 'Matching visual beats with whooshes, risers, foley, and ambient sound beds.',
            descriptionSo: 'Isku xirka garaaca muusigga iyo dhaqdhaqaaqa muuqaalka adoo adeegsanaya foley iyo SFX.',
            order: 3
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Professional Color Grading in DaVinci Resolve',
        titleSo: 'Qeybta 2: Sixidda Midabada Heerka Sare ee DaVinci Resolve',
        order: 2,
        lessons: [
          {
            id: 'les-1-4',
            title: 'DaVinci Resolve Node Tree Architecture for Commercial Work',
            titleSo: 'Dhisidda Qaab-dhismeedka Nodes-ka ee DaVinci Resolve',
            duration: '25:10',
            durationSeconds: 1510,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            isPreview: false,
            description: 'Building a repeatable 12-node grading tree from exposure balance to film emulation.',
            descriptionSo: 'Qaabeynta nidaamka 12-ka node ee dammaanad qaadaya xasiloonida midabada filim kasta.',
            order: 4,
            resources: [
              {
                id: 'res-4',
                title: 'Abdala Silver Signature Node Tree Template (.drx)',
                type: 'preset',
                fileSize: '8.4 MB',
                url: 'https://abdalasilver.com/downloads/silver_node_tree.drx'
              }
            ]
          },
          {
            id: 'les-1-5',
            title: 'Accurate Skin Tone Isolation and Natural Retouching',
            titleSo: 'Kala Saaridda Midabka Maqaarka (Skin Tones) & Qurxinta Dabiiciga ah',
            duration: '20:30',
            durationSeconds: 1230,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            isPreview: false,
            description: 'Using vectorscopes and 3D qualifiers to ensure realistic melanin tones across lighting setups.',
            descriptionSo: 'Adeegsiga vectorscope si loo hubiyo saxnaanta midabka maqaarka dabiiciga ah.',
            order: 5
          },
          {
            id: 'les-1-6',
            title: 'Exporting for Netflix, Cinema DCI-P3, and YouTube HDR',
            titleSo: 'Dhoofinta Muuqaalka ee Netflix, Shineemooyinka, iyo YouTube HDR',
            duration: '16:50',
            durationSeconds: 1010,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPreview: false,
            description: 'Master bitrates, ProRes 422 HQ, DNxHR, and Rec.709 gamma tags without color shifts.',
            descriptionSo: 'Dhoofinta muuqaallada iyadoo aan tayada iyo midabku isbeddelin marka la geliyo internetka.',
            order: 6
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Brand Identity Design Systems with Adobe Illustrator & Photoshop',
    titleSo: 'Naqshadaynta Sumadaha Ganacsiga (Brand Identity) & Adobe Illustrator',
    slug: 'brand-identity-design-systems',
    tagline: 'Craft iconic logos, comprehensive visual guidelines, and brand systems that command premium rates.',
    taglineSo: 'Samee astaamo (logos) heer sare ah iyo hagaha sumadda oo aad kaga iibsan karto shirkadaha waaweyn.',
    description: 'Learn how to think like a design director. From client discovery questions to vector logo geometry, color theory for print and screen, typography pairing, and producing 40-page brand guidelines books in Adobe Illustrator and InDesign.',
    descriptionSo: 'Baro sida loo fekero sida Agaasime Naqshadeed. Laga bilaabo waraysiga macmiilka ilaa sawiridda astaanta vector-ka, doorashada noocyada farta, iyo diyaarinta buugga sharciga sumadda (Brand Guidelines).',
    category: 'graphic-design',
    level: 'Beginner',
    instructorId: 'user-admin',
    instructorName: 'Abdala Silver & Guest Mentor',
    instructorTitle: 'Brand Strategist & Art Director',
    instructorAvatar: '/src/assets/images/abdala_hero_studio_1792842639594.jpg',
    thumbnail: '/src/assets/images/course_graphic_design_1792842654199.jpg',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '11h 20m',
    totalLessons: 10,
    price: 39,
    currency: 'USD',
    isPublished: true,
    isFeatured: true,
    language: 'Bilingual',
    enrollmentCount: 980,
    rating: 4.85,
    createdAt: '2024-06-20',
    updatedAt: '2024-10-18',
    prerequisites: [
      'No prior graphic design experience required',
      'Adobe Illustrator and Photoshop installed (free trial is sufficient)'
    ],
    whatYouWillLearn: [
      'The complete creative discovery questionnaire for commercial clients',
      'Vector geometry, golden ratio grids, and pen tool precision in Illustrator',
      'Curating harmonious color palettes with high accessibility contrast',
      'Modern typography pairing (Serif, Sans, Monospace balance)',
      'Designing realistic 3D product and stationery mockups in Photoshop'
    ],
    whatYouWillLearnSo: [
      'Sida loola macaamilo macaamiisha loona qaado macluumaadka mashruuca',
      'Adeegsiga Pen Tool-ka iyo nidaamka Golden Ratio ee astaanta',
      'Doorashada midabada is-waafaqsan iyo sharciyada akhriska',
      'Isku-dhafka faraha casriga ah ee xayeysiisyada',
      'Diyaarinta mockups 3D ah oo cajiib ah gudaha Photoshop'
    ],
    modules: [
      {
        id: 'mod-2-1',
        title: 'Module 1: Design Fundamentals & The Creative Brief',
        titleSo: 'Qeybta 1: Aasaaska Naqshadda & Qoraalka Macmiilka',
        order: 1,
        lessons: [
          {
            id: 'les-2-1',
            title: 'Deconstructing Great Brand Identifiers: Why Some Stick',
            titleSo: 'Falanqaynta Astaamaha Caanka ah: Sababta Ay U Guulaystaan',
            duration: '12:40',
            durationSeconds: 760,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            isPreview: true,
            description: 'Why visual identity is more than just a logo and how strategy shapes perception.',
            descriptionSo: 'Sababta sumaddu uga badan tahay oo keliya calaamad (logo) iyo doorka istaraatiijiyadda.',
            order: 1
          },
          {
            id: 'les-2-2',
            title: 'Pen Tool Fluency: Mastering Anchor Points and Bezier Handles',
            titleSo: 'Awoodda Pen Tool-ka: Xakamaynta Anchor Points iyo Bezier Handles',
            duration: '24:10',
            durationSeconds: 1450,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            isPreview: true,
            description: 'Zero frustration guide to drawing clean curved paths with minimum anchor points.',
            descriptionSo: 'Hagaha ugu fudud ee aad ku sawiri karto khadadka wareegsan adoo isticmaalaya qodobada ugu yar.',
            order: 2,
            resources: [
              {
                id: 'res-5',
                title: 'Vector Pen Tool Practice Exercises (.ai)',
                type: 'preset',
                fileSize: '5.2 MB',
                url: 'https://abdalasilver.com/downloads/pen_tool_mastery.ai'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Kinetic Typography & Motion Graphics in After Effects',
    titleSo: 'Muuqaallada Dhaqdhaqaaqa (Motion Graphics) & After Effects',
    slug: 'kinetic-typography-motion-graphics-after-effects',
    tagline: 'Bring still graphic designs to life with dynamic easing, kinetic text, and commercial broadcast animation.',
    taglineSo: 'U yeel naqshadahaaga dhaqdhaqaaq soo jiidasho leh oo xayeysiisyada casriga ah looga baahan yahay.',
    description: 'Master Adobe After Effects from the ground up. Learn the 12 principles of animation applied to UI/UX motion, kinetic typography for social ads, shape layer morphing, camera parallax, and creating reusable motion graphics templates (MOGRTs).',
    descriptionSo: 'Baro Adobe After Effects si qoto dheer. Faham 12-ka sharci ee animation-ka, dhaqaajinta faraha (Kinetic Typography), qaab-dhismeedka 3D camera-yada, iyo samaynta MOGRT templates.',
    category: 'motion-graphics',
    level: 'Intermediate',
    instructorId: 'user-instructor',
    instructorName: 'Hamza Ali',
    instructorTitle: 'Senior Motion Designer',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    thumbnail: '/src/assets/images/course_motion_graphics_1792842654865.jpg',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: '12h 10m',
    totalLessons: 11,
    price: 45,
    currency: 'USD',
    isPublished: true,
    isFeatured: true,
    language: 'Somali',
    enrollmentCount: 760,
    rating: 4.92,
    createdAt: '2024-07-05',
    updatedAt: '2024-10-10',
    prerequisites: [
      'Basic knowledge of Adobe Illustrator or Photoshop layers',
      'Adobe After Effects installed'
    ],
    whatYouWillLearn: [
      'Understanding Graph Editor: Speed graphs vs Value graphs',
      'Text animator properties: Range selectors, wiggle, and character tracking',
      'Seamless morphing transitions between geometric shapes',
      'Camera depth of field and 3D null controller rigs',
      'Exporting lightweight Lottie JSON for web and iOS/Android applications'
    ],
    whatYouWillLearnSo: [
      'Fahamka Graph Editor: Xawaaraha iyo xakamaynta jilicsanaanta dhaqdhaqaaqa',
      'Dhaqaajinta xarfaha iyo jumlada (Text Range Selectors)',
      'Kala beddelidda qaababka (Shape Morphing)',
      'Dhismaha kaamirada 3D iyo maamulka Null Objects',
      'Dhoofinta faylasha Lottie JSON ee website-yada iyo apps-ka'
    ],
    modules: [
      {
        id: 'mod-3-1',
        title: 'Module 1: The Physics of Motion & The Graph Editor',
        titleSo: 'Qeybta 1: Fiisigiska Dhaqdhaqaaqa & Graph Editor',
        order: 1,
        lessons: [
          {
            id: 'les-3-1',
            title: 'Easing Curves That Feel Human: Overcoming Linear Keyframes',
            titleSo: 'Jilicsanaanta Dhaqdhaqaaqa: Ka Gudubka Keyframes-ka Qallafsan',
            duration: '16:30',
            durationSeconds: 990,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            isPreview: true,
            description: 'Why default Easy Ease looks amateur and how to sculpt custom acceleration curves in the Graph Editor.',
            descriptionSo: 'Sababta Easy Ease-ka caadiga ahi uusan u qurux badnayn iyo sida Graph Editor loogu habeeyo si xirfadeed.',
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    title: 'The Solo Creator Blueprint: Studio Gear, Lighting & Viral Short-Form Growth',
    titleSo: 'Hagaha Abuuraha Keliga ah: Qalabka, Iftiinka & Koritaanka TikTok & YouTube',
    slug: 'solo-creator-studio-lighting-growth',
    tagline: 'Build a profitable digital content creation studio from your room and build an audience.',
    taglineSo: 'Dhis istuudiyo dakhli soo saara qolkaaga dhexdiisa adigoo baranaya iftiinka, codka, iyo sheeko-abuurka.',
    description: 'Learn how to produce high-retention video content for YouTube, TikTok, and Instagram Reels. Covers 3-point studio lighting, dynamic camera angles, microphone selection, script hooks, hook psychology, and monetizing your audience.',
    descriptionSo: 'Baro sida loo soo saaro muuqaallo dadka qabanaya oo loogu talagalay YouTube, TikTok, iyo Instagram Reels. Waxaa ku jira nidaamka 3-point lighting, codka tayada sare leh, qorista qoraalka muuqaalka, iyo dakhli abuurka.',
    category: 'content-creation',
    level: 'Beginner',
    instructorId: 'user-admin',
    instructorName: 'Abdala Silver',
    instructorTitle: 'Digital Media Director & Creator',
    instructorAvatar: '/src/assets/images/abdala_hero_studio_1792842639594.jpg',
    thumbnail: '/src/assets/images/course_content_creation_1792842667723.jpg',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '09h 50m',
    totalLessons: 9,
    price: 35,
    currency: 'USD',
    isPublished: true,
    isFeatured: true,
    language: 'Bilingual',
    enrollmentCount: 1680,
    rating: 4.95,
    createdAt: '2024-04-18',
    updatedAt: '2024-10-20',
    prerequisites: [
      'Smartphone camera or mirrorless camera',
      'Desire to produce public content'
    ],
    whatYouWillLearn: [
      '3-Point lighting setup on a budget: Key light, fill light, and hair/rim light',
      'The 3-second hook framework that spikes retention on vertical video',
      'Acoustic treatment and microphone gain staging for podcast-crisp audio',
      'Teleprompter speaking techniques without looking like you are reading',
      'Brand sponsorship pitching and client retainer packaging'
    ],
    whatYouWillLearnSo: [
      'Iftiinka 3-Point Lighting ee qolka adigoo adeegsanaya qalab jaban',
      'Xeerka 3-da ilbiriqsi ee dadka ku xiraya muuqaalkaaga gaaban',
      'Hagaajinta codka iyo isticmaalka makarafoonada xirfadeed',
      'Farsamada akhriska teleprompter-ka adigoo dabiici u muuqanaya',
      'Sida loola heshiiyo shirkadaha xayeysiiska loo qabanayo'
    ],
    modules: [
      {
        id: 'mod-4-1',
        title: 'Module 1: Studio Setup & Lighting Fundamentals',
        titleSo: 'Qeybta 1: Dhisidda Istuudiyaha & Barashada Iftiinka',
        order: 1,
        lessons: [
          {
            id: 'les-4-1',
            title: 'Transforming Any Bedroom into a Cinematic YouTube Studio',
            titleSo: 'U beddel qol kasta istuudiyo filim oo YouTube loogu talagalay',
            duration: '15:15',
            durationSeconds: 915,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPreview: true,
            description: 'Room depth, background practical lights, diffusion, and camera focal lengths.',
            descriptionSo: 'Dhisidda qoto-dheernaanta qolka, laydhadhka dhabarka, iyo lenses-ka saxda ah.',
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Generative AI for Creatives: Midjourney, Stable Diffusion & Neural Video',
    titleSo: 'Sirdoonka Macmalka ah (AI) ee Hal-abuurka: Midjourney, Diffusion & Muuqaallada AI',
    slug: 'generative-ai-for-creatives-midjourney-diffusion',
    tagline: 'Supercharge your creative workflow by blending human artistic vision with state-of-the-art AI synthesis.',
    taglineSo: 'Kordhi awooddaada hal-abuur adoo isku daraya fikirkaaga farshaxanimo iyo awoodda casriga ah ee AI.',
    description: 'Learn the exact prompt engineering syntax, weights, aspect ratios, and stylize parameters to generate commercial-grade concept art, stock imagery, fashion shoots, storyboard visuals, and AI video animation using Midjourney, ComfyUI, Runway, and Kling.',
    descriptionSo: 'Baro qaaciidooyinka qorista prompt-ka, maamulka weights-ka, iyo sida loo soo saaro sawirro heer ganacsi ah, dhar-xayeysiin, iyo muuqaallo AI ah adoo adeegsanaya Midjourney, Stable Diffusion, iyo Runway.',
    category: 'artificial-intelligence',
    level: 'Beginner',
    instructorId: 'user-admin',
    instructorName: 'Abdala Silver & AI Research Team',
    instructorTitle: 'AI Creative Director',
    instructorAvatar: '/src/assets/images/abdala_hero_studio_1792842639594.jpg',
    thumbnail: '/src/assets/images/course_ai_learning_1792842667505.jpg',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '10h 30m',
    totalLessons: 8,
    price: 49,
    currency: 'USD',
    isPublished: true,
    isFeatured: true,
    language: 'Bilingual',
    enrollmentCount: 1140,
    rating: 4.9,
    createdAt: '2024-08-10',
    updatedAt: '2024-10-22',
    prerequisites: [
      'Basic web browsing skills',
      'Curiosity for modern creative technologies'
    ],
    whatYouWillLearn: [
      'Midjourney v6 parameters: --s, --c, --w, camera lenses and film stock prompting',
      'Image-to-image styling, character consistency across multiple poses',
      'Upscaling and print-ready high-resolution rendering',
      'AI video motion generation: Camera controls, pan, zoom, and prompt pacing',
      'Commercial copyright laws, ethics, and selling AI creative services'
    ],
    whatYouWillLearnSo: [
      'Farsamada qorista Midjourney v6: Lenses-ka kaamirada iyo sharciyada filimka',
      'Xafididda wejiga iyo qofka sawirro kala duwan (Character Consistency)',
      'Kordhinta tayada sawirka si daabacaad weyn loogu isticmaalo (Upscaling)',
      'Abuurista muuqaallada dhaqdhaqaaqa leh ee AI (Runway & Kling)',
      'Sharciyada iyo suuqa iibinta adeegyada hal-abuurka AI'
    ],
    modules: [
      {
        id: 'mod-5-1',
        title: 'Module 1: The Prompt Matrix & Midjourney v6 Precision',
        titleSo: 'Qeybta 1: Qaab-dhismeedka Prompt-ka & Midjourney v6',
        order: 1,
        lessons: [
          {
            id: 'les-5-1',
            title: 'Deconstructing the Perfect Creative Prompt',
            titleSo: 'Sida loo qoro Prompt dhamaystiran oo soo saara natiijo heer sare ah',
            duration: '18:10',
            durationSeconds: 1090,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            isPreview: true,
            description: 'Why keyword stuffing fails and how lighting, angle, and materials control the output.',
            descriptionSo: 'Sababta kalmadaha badan looga fogaado iyo sida iftiinka iyo xagalka kaamirada loo qeexo.',
            order: 1,
            resources: [
              {
                id: 'res-6',
                title: 'Midjourney Prompt Engineering Handbook 2026 (PDF)',
                type: 'pdf',
                fileSize: '4.8 MB',
                url: 'https://abdalasilver.com/downloads/midjourney_handbook.pdf'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-6',
    title: 'CapCut Masterclass: Fast Mobile & Desktop Edits for Viral Creators',
    titleSo: 'Koorso Bilaash ah: Barashada CapCut ee Taleefanka & Kumbuyuutarka',
    slug: 'capcut-fast-edits-mobile-desktop',
    tagline: 'Start editing impactful videos today with zero paid subscriptions required.',
    taglineSo: 'Ku bilow barashada farsamada muuqaalka maanta adigoon bixin wax lacag ah.',
    description: 'A 100% free starter course covering CapCut on PC and Mobile. Learn auto-captions, keyframe zoom transitions, sound effects, beat matching, and color grading presets to get your first editing gig.',
    descriptionSo: 'Koorso bilaash ah oo loogu talagalay arday kasta oo doonaya inuu bilaabo editing-ka. Baro qoraalka tooska ah ee hadalka (Auto-captions), kala-guurka degdegga ah, iyo habeynta codadka.',
    category: 'video-editing',
    level: 'Beginner',
    instructorId: 'user-admin',
    instructorName: 'Abdala Silver',
    instructorTitle: 'Digital Media Director',
    instructorAvatar: '/src/assets/images/abdala_hero_studio_1792842639594.jpg',
    thumbnail: '/src/assets/images/course_video_edit_1792842654103.jpg',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '04h 30m',
    totalLessons: 6,
    price: 0,
    currency: 'USD',
    isPublished: true,
    isFeatured: true,
    language: 'Bilingual',
    enrollmentCount: 3840,
    rating: 4.96,
    createdAt: '2024-03-01',
    updatedAt: '2024-10-21',
    prerequisites: [
      'Any mobile phone or PC/Mac computer',
      'Free CapCut app installed'
    ],
    whatYouWillLearn: [
      'Timeline cutting, split points, and speed ramping',
      'Dynamic animated subtitles with emojis and sound cues',
      'Green screen and chroma key background replacement',
      'Exporting in 1080p 60fps with crystal clear mobile compression'
    ],
    whatYouWillLearnSo: [
      'Kala goynta muuqaalka iyo kordhinta/dhimista xawaaraha',
      'Qoraallada dhaqdhaqaaqa leh ee Af-Soomaaliga iyo Ingiriiska',
      'Beddelidda dhabarka cagaaran (Green Screen Removal)',
      'Dhoofinta muuqaalka oo tayo sare leh oo aan qashin gelin'
    ],
    modules: [
      {
        id: 'mod-6-1',
        title: 'Module 1: Quick Cut Foundations',
        titleSo: 'Qeybta 1: Aasaaska Jarista Degdegga ah',
        order: 1,
        lessons: [
          {
            id: 'les-6-1',
            title: 'Interface Tour & Best Project Settings',
            titleSo: 'Barashada Shaashadda & Dejinta Mashruuca',
            duration: '11:15',
            durationSeconds: 675,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPreview: true,
            description: 'Getting comfortable with CapCut desktop and mobile workflows.',
            descriptionSo: 'Fahamka qalabka iyo sida mashruuca loo bilaabo.',
            order: 1
          },
          {
            id: 'les-6-2',
            title: 'Adding Sound FX & Visual Punch',
            titleSo: 'Ku Darista Codadka & Saamaynta Muuqaalka',
            duration: '14:20',
            durationSeconds: 860,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            isPreview: true,
            description: 'Elevating average videos into engaging content.',
            descriptionSo: 'Sida muuqaalka caadiga ah looga dhigo mid soo jiita daawadayaasha.',
            order: 2
          }
        ]
      }
    ]
  }
];

export const INITIAL_REVIEWS: CourseReview[] = [
  {
    id: 'rev-1',
    courseId: 'course-1',
    userId: 'user-student',
    userName: 'Fatima Warsame',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    comment: 'Koorsadani waxay gabi ahaanba beddeshay sida aan wax u edit-gareeyo! Sharraxaadda Abdala Silver ee Color Grading-ka DaVinci Resolve waa tii ugu fiicnayd ee aan abid arko. Waxaan hadda bilaabay inaan macaamiil caalami ah shaqo u qabto.',
    date: '2024-09-14'
  },
  {
    id: 'rev-2',
    courseId: 'course-1',
    userId: 'user-rev-2',
    userName: 'Ahmed K.',
    rating: 5,
    comment: 'The node tree workflow taught in module 2 alone is worth 10x the course price. Real 4K RED clips to practice with made everything click immediately.',
    date: '2024-09-28'
  },
  {
    id: 'rev-3',
    courseId: 'course-4',
    userId: 'user-rev-3',
    userName: 'Sahra M. Nur',
    rating: 5,
    comment: 'Waxaan ka faa\'iiday sida iftiinka qolka loogu habeeyo adigoon wax badan kharash gareyn. Waxaan YouTube-ka ku bilaabay kalsooni buuxda!',
    date: '2024-10-02'
  },
  {
    id: 'rev-4',
    courseId: 'course-3',
    userId: 'user-rev-4',
    userName: 'Khadar Barre',
    rating: 5,
    comment: 'Hamza Ali explains the After Effects Graph Editor in Somali so clearly. I finally understand easing and kinetic typography.',
    date: '2024-10-11'
  }
];

export const INITIAL_DISCOUNTS: DiscountCode[] = [
  {
    id: 'disc-1',
    code: 'SILVER50',
    discountPercent: 50,
    isActive: true,
    validUntil: '2026-12-31'
  },
  {
    id: 'disc-2',
    code: 'SOMALICREATOR',
    discountPercent: 30,
    isActive: true,
    validUntil: '2026-12-31'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'New Masterclass Released: DaVinci Resolve 19 Advanced Workflows',
    titleSo: 'Koorso Cusub ayaa soo baxday: DaVinci Resolve 19 iyo Farsamooyinka Casriga ah',
    message: 'All enrolled students can now access new bonus lessons on AI tracking, magic masks, and Dolby Vision delivery.',
    messageSo: 'Dhammaan ardayda ku qoran koorsada waxay hadda daawan karaan casharro dheeraad ah oo ku saabsan AI tracking.',
    date: '2024-10-20',
    type: 'update',
    active: true
  }
];
