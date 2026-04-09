/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Model data defined directly for ease of use and type safety
const MODELS_DATA: Record<string, { name: string; chineseName: string; desc: string; enDesc: string }> = {
  "1800": {
    name: "MODEL 1800",
    chineseName: "溯源 · Origin",
    desc: "剥离繁冗，回归石材最原始的纯粹。以极简线条勾勒空间骨架，让静谧在留白中流淌。",
    enDesc: "Stripping away the redundant, returning to the primal purity of stone. Outlining the spatial skeleton with minimalist lines, letting tranquility flow in the void."
  },
  "1807": {
    name: "MODEL 1807",
    chineseName: "铸迹 · Trace",
    desc: "工业文明与自然造物的交响。粗犷的质感中蕴含着细腻的逻辑，展现力量与美感的平衡。",
    enDesc: "A symphony of industrial civilization and natural creation. Delicate logic embedded within rugged textures, showcasing the balance between power and beauty."
  },
  "2802": {
    name: "MODEL 2802",
    chineseName: "脉动 · Pulse",
    desc: "捕捉亿万年地壳运动留下的韵律。流动的纹理如江河入海，赋予冰冷石材温润的生命感。",
    enDesc: "Capturing the rhythm left by millions of years of tectonic movements. Flowing textures like rivers entering the sea, bestowing a warm sense of life upon the cold stone."
  },
  "5021": {
    name: "MODEL 5021",
    chineseName: "熔岩 · Lava",
    desc: "炽热而内敛，仿佛凝固的熔岩。展现大自然最原始、最狂野的生命力。",
    enDesc: "Fiery yet restrained, like solidified lava. Revealing the most primitive and wild vitality of nature."
  },
  "6007": {
    name: "MODEL 6007",
    chineseName: "晨曦 · Dawn",
    desc: "如清晨的第一缕阳光，穿透薄雾，为空间带来温暖而柔和的质感。",
    enDesc: "Like the first ray of morning sun piercing through the mist, bringing a warm and soft texture to the space."
  },
  "6107": {
    name: "MODEL 6107",
    chineseName: "墨韵 · Ink Rhythm",
    desc: "水墨般的纹理，在石材上挥洒自如。展现东方美学的深邃与灵动。",
    enDesc: "Ink-like textures splashing freely across the stone. Showcasing the depth and agility of Eastern aesthetics."
  },
  "6108": {
    name: "MODEL 6108",
    chineseName: "青峦 · Green Peaks",
    desc: "如远山青黛，层峦叠嶂。在石材的纹理中感受大山的厚重与宁静。",
    enDesc: "Like distant green mountains and overlapping peaks. Feeling the weight and serenity of the mountains within the stone's texture."
  },
  "6109": {
    name: "MODEL 6109",
    chineseName: "秋水 · Autumn Water",
    desc: "澄澈如秋水，明净而深远。捕捉自然界最纯净的瞬间，定格于石材之上。",
    enDesc: "Clear as autumn water, bright and far-reaching. Capturing the purest moments of nature and freezing them upon the stone."
  },
  "6361": {
    name: "MODEL 6361",
    chineseName: "星尘 · Stardust",
    desc: "微小的矿物颗粒如星尘般闪耀，在深邃的基底上勾勒出宇宙的奥秘。",
    enDesc: "Tiny mineral particles shining like stardust, outlining the mysteries of the universe on a deep substrate."
  },
  "682": {
    name: "MODEL 682",
    chineseName: "幻境 · Mirage",
    desc: "虚实交错的纹理，如同沙漠中的海市蜃楼，带给空间无限的遐想。",
    enDesc: "Intertwining textures of reality and illusion, like a mirage in the desert, bringing infinite imagination to the space."
  },
  "683": {
    name: "MODEL 683",
    chineseName: "幽谷 · Deep Valley",
    desc: "深邃如幽谷，静谧而深远。石材的天然纹路在此刻化作大地的诗篇。",
    enDesc: "Deep as a hidden valley, quiet and profound. The natural veins of the stone transform into a poetic chapter of the earth."
  },
  "686": {
    name: "MODEL 686",
    chineseName: "流云 · Floating Clouds",
    desc: "轻盈如流云，灵动而自然。为沉稳的石材注入一份飘逸的灵性。",
    enDesc: "Light as floating clouds, agile and natural. Injecting a sense of ethereal spirituality into the steady stone."
  },
  "7002": {
    name: "MODEL 7002",
    chineseName: "沉境 · Submersion",
    desc: "深邃的灰调如同破晓前的海面。在克制的色彩中探索空间的深度，营造极致的沉浸式美学。",
    enDesc: "Deep gray tones like the sea before dawn. Exploring spatial depth within restrained colors, creating an ultimate immersive aesthetic."
  },
  "7005": {
    name: "MODEL 7005",
    chineseName: "息壤 · Breath",
    desc: "捕捉自然界最轻盈的呼吸。石材不再是沉重的存在，而是光影交织下的灵动注脚。",
    enDesc: "Capturing the lightest breath of nature. Stone is no longer a heavy existence, but an agile footnote under the interplay of light and shadow."
  },
  "7059": {
    name: "MODEL 7059",
    chineseName: "暮色 · Twilight",
    desc: "如黄昏时的余晖，温柔而深沉。为空间营造一份宁静而温馨的氛围。",
    enDesc: "Like the afterglow at dusk, gentle and deep. Creating a peaceful and warm atmosphere for the space."
  },
  "7305": {
    name: "MODEL 7305",
    chineseName: "寒蝉 · Winter Cicada",
    desc: "冷峻而孤傲，展现石材在极端环境下的坚韧与纯粹。",
    enDesc: "Cold and aloof, showcasing the resilience and purity of stone under extreme environments."
  },
  "9002": {
    name: "MODEL 9002",
    chineseName: "金域 · Golden Realm",
    desc: "大面积的金色纹理交织，营造出如宫殿般的辉煌气场，是尊贵身份的象征。",
    enDesc: "Interweaving large areas of golden textures, creating a magnificent aura like a palace, a symbol of noble status."
  },
  "9002-A": {
    name: "MODEL 9002-A",
    chineseName: "流金 · Flowing Gold",
    desc: "金色的纹理如流沙般穿梭其间，展现石材的高贵与奢华质感。",
    enDesc: "Golden textures flowing like shifting sands, showcasing the noble and luxurious quality of the stone."
  },
  "9004": {
    name: "MODEL 9004",
    chineseName: "极简 · Minimalism",
    desc: "极致的简约，不带一丝冗余。在纯粹的线条中寻找生活的真谛。",
    enDesc: "Ultimate simplicity without a trace of redundancy. Finding the truth of life within pure lines."
  },
  "9012": {
    name: "MODEL 9012",
    chineseName: "幻影 · Phantom",
    desc: "变幻莫测的纹路，如同光影下的幻象，赋予空间无限的动感。",
    enDesc: "Ever-changing patterns like illusions under light and shadow, giving the space infinite dynamic energy."
  },
  "9030": {
    name: "MODEL 9030",
    chineseName: "静谧 · Serenity",
    desc: "如深夜的湖面，波澜不惊。在静谧中感受石材带来的平和与安宁。",
    enDesc: "Like a midnight lake, calm and undisturbed. Feeling the peace and tranquility brought by the stone."
  },
  "9031": {
    name: "MODEL 9031",
    chineseName: "破晓 · Daybreak",
    desc: "如黎明前的第一道曙光，打破黑暗，为空间注入希望与活力。",
    enDesc: "Like the first light before dawn, breaking the darkness and injecting hope and vitality into the space."
  },
  "9042": {
    name: "MODEL 9042",
    chineseName: "锋芒 · Edge",
    desc: "打破常规的几何构想，探索石材在未来维度中的表达。前卫、锐利，且富有哲思。",
    enDesc: "Breaking conventional geometric concepts, exploring the expression of stone in future dimensions. Avant-garde, sharp, and philosophical."
  },
  "9088": {
    name: "MODEL 9088",
    chineseName: "岚影 · Mist",
    desc: "细腻的灰阶过渡，宛如远山在晨雾中若隐若现。为空间注入一份朦胧而高级的艺术诗意。",
    enDesc: "Delicate grayscale transitions, like distant mountains appearing faintly in the morning mist. Injecting a hazy and high-end artistic poetry into the space."
  },
  "9093": {
    name: "MODEL 9093",
    chineseName: "流光 · Streaming Light",
    desc: "光影在石材表面跳跃，展现出多维度的视觉魅力，灵动而高级。",
    enDesc: "Light and shadow dancing on the stone surface, revealing multi-dimensional visual charm, agile and sophisticated."
  },
  "9094": {
    name: "MODEL 9094",
    chineseName: "映辉 · Radiance",
    desc: "独特的矿物结晶捕捉每一缕微光。在不同角度的审视下，展现石材多维度的流光魅力。",
    enDesc: "Unique mineral crystals capturing every ray of light. Revealing the shimmering charm of stone from different perspectives."
  },
  "9103": {
    name: "MODEL 9103",
    chineseName: "极夜 · Absolute Night",
    desc: "极致的黑，是所有色彩的终点，也是想象力的起点。在无声的深邃中，定义空间的绝对权威。",
    enDesc: "Absolute black, the end of all colors and the starting point of imagination. Defining the absolute authority of space in silent depth."
  },
  "9139": {
    name: "MODEL 9139",
    chineseName: "暖阳 · Amber",
    desc: "柔和的色泽中蕴含着大地的温度。如冬日暖阳洒在石阶上，为居家空间带来一份治愈的温馨。",
    enDesc: "Earthly warmth within soft hues. Like winter sun shining on stone steps, bringing a healing warmth to the home."
  },
  "9154": {
    name: "MODEL 9154",
    chineseName: "磐石 · Monolith",
    desc: "厚重的大地色系，承载着岁月的稳重。以磐石之姿，为现代建筑奠定坚实的审美基石。",
    enDesc: "Heavy earth tones carrying the stability of years. Laying a solid aesthetic foundation for modern architecture with a monolithic presence."
  },
  "9181": {
    name: "MODEL 9181",
    chineseName: "凝霜 · Frost",
    desc: "剔透的质感仿佛万年不化的冰川。冷冽而高洁，在纯净的视觉体验中洗涤心灵的浮躁。",
    enDesc: "A translucent texture like glaciers that never melt for ten thousand years. Cold and noble, cleansing the soul's restlessness in a pure visual experience."
  },
  "9186": {
    name: "MODEL 9186",
    chineseName: "典藏 · Heritage",
    desc: "融合古典艺术的厚重与现代设计的灵动。每一道纹路都是时间的刻痕，讲述着跨越时空的审美故事。",
    enDesc: "Merging the weight of classical art with the agility of modern design. Every vein is a mark of time, telling an aesthetic story that spans across eras."
  },
  "9237": {
    name: "MODEL 9237",
    chineseName: "幻沙 · Phantom Sand",
    desc: "灵动的纹路如风吹过沙漠留下的印记。在静止的石材中展现动态的幻影。",
    enDesc: "Agile veins like imprints left by the wind blowing across the desert. Revealing dynamic phantoms within the static stone."
  },
  "9243": {
    name: "MODEL 9243",
    chineseName: "盈白 · Pristine White",
    desc: "极致的白，不染尘埃。如初雪覆盖大地，在无限的纯净中，拓宽空间的视觉边界。",
    enDesc: "Ultimate white, untainted by dust. Like fresh snow covering the earth, broadening the visual boundaries of space in infinite purity."
  },
  "9257": {
    name: "MODEL 9257",
    chineseName: "繁星 · Starry Sky",
    desc: "璀璨的矿物颗粒如星辰散落。在深邃的基底上，勾勒出一幅永恒的宇宙画卷，浪漫且神秘。",
    enDesc: "Brilliant mineral particles scattered like stars. Outlining an eternal cosmic scroll on a deep base, romantic and mysterious."
  },
  "P012": {
    name: "MODEL P012",
    chineseName: "尊享 · Exclusive",
    desc: "为极致审美而生，展现石材的独特魅力与尊贵气质。",
    enDesc: "Born for the ultimate aesthetic, showcasing the unique charm and noble temperament of the stone."
  },
  "P013": {
    name: "MODEL P013",
    chineseName: "至臻 · Perfection",
    desc: "追求极致的完美，每一处细节都经过精心雕琢，展现石材的巅峰之美。",
    enDesc: "Pursuing ultimate perfection, every detail is meticulously carved, showcasing the pinnacle beauty of the stone."
  }
};

const MODEL_IDS = Object.keys(MODELS_DATA);

export default function App() {
  const [currentId, setCurrentId] = useState<string>("1800");
  const [direction, setDirection] = useState(0);

  // Initialize from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id && MODELS_DATA[id]) {
      setCurrentId(id);
    }
  }, []);

  // Update URL without refresh
  const updateUrl = useCallback((id: string) => {
    const newUrl = `${window.location.pathname}?id=${id}`;
    window.history.pushState({ id }, "", newUrl);
  }, []);

  const navigate = useCallback((newDirection: number) => {
    const currentIndex = MODEL_IDS.indexOf(currentId);
    let nextIndex = currentIndex + newDirection;
    
    if (nextIndex < 0) nextIndex = MODEL_IDS.length - 1;
    if (nextIndex >= MODEL_IDS.length) nextIndex = 0;
    
    const nextId = MODEL_IDS[nextIndex];
    setDirection(newDirection);
    setCurrentId(nextId);
    updateUrl(nextId);
  }, [currentId, updateUrl]);

  const currentModel = MODELS_DATA[currentId];

  // Handle swipe gestures
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-white selection:text-black">
      {/* Immersive Full-Screen Image Section */}
      <section className="relative h-[65vh] md:h-screen w-full overflow-hidden group touch-none">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentId}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? "100%" : "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? "-100%" : "100%" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                navigate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                navigate(-1);
              }
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <img
              src={`/${currentId}.jpg`}
              alt={currentModel.name}
              className="w-full h-full object-cover pointer-events-none"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const currentSrc = target.src;
                
                // Fallback chain: jpg -> webp -> png -> placeholder
                if (currentSrc.includes('.jpg')) {
                  target.src = `/${currentId}.webp`;
                } else if (currentSrc.includes('.webp')) {
                  target.src = `/${currentId}.png`;
                } else if (!currentSrc.includes('picsum.photos')) {
                  target.src = `https://picsum.photos/seed/${currentId}/1920/1080?grayscale`;
                }
              }}
            />
            {/* Subtle Overlay for Dark Theme */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Optimized for Mobile Touch with larger sensing area */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 bottom-0 w-24 flex items-center justify-center bg-transparent z-20 active:bg-white/5 transition-colors"
          aria-label="Previous"
        >
          <div className="p-2 bg-black/20 backdrop-blur-sm rounded-full pointer-events-none">
            <ChevronLeft className="w-6 h-6 text-white/50" />
          </div>
        </button>
        <button
          onClick={() => navigate(1)}
          className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center bg-transparent z-20 active:bg-white/5 transition-colors"
          aria-label="Next"
        >
          <div className="p-2 bg-black/20 backdrop-blur-sm rounded-full pointer-events-none">
            <ChevronRight className="w-6 h-6 text-white/50" />
          </div>
        </button>

        {/* Floating Model Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 max-w-[80vw] overflow-x-auto no-scrollbar px-4">
          {MODEL_IDS.map((id) => (
            <div
              key={id}
              className={`h-1 transition-all duration-300 flex-shrink-0 ${
                id === currentId ? "w-6 bg-white" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Content Section - Optimized for Mobile Reading */}
      <main className="px-6 py-12 max-w-2xl mx-auto relative z-10">
        <motion.div
          key={`content-${currentId}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-extralight tracking-[0.2em] uppercase text-white/90">
              {currentModel.name}
            </h1>
            <div className="h-[1px] w-12 bg-white/30" />
            <p className="text-lg md:text-2xl font-light tracking-widest text-white/60">
              {currentModel.chineseName}
            </p>
          </div>

          <div className="space-y-4 text-sm md:text-lg leading-relaxed text-white/40 font-extralight tracking-wider">
            <p className="border-l border-white/10 pl-4 italic">{currentModel.enDesc}</p>
            <p className="pl-4">{currentModel.desc}</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5 text-center">
        <p className="text-[10px] tracking-[0.2em] text-white/20 uppercase font-light">
          © 21 Construction Depot
        </p>
      </footer>

      {/* Global Styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Hide watermarks */
        .ais-watermark, #ais-watermark, [class*="watermark"] {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
}
