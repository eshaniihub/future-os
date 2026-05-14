import { supabase }
from "./supabase";
import {
  useState,
  useEffect,
  useRef
}from "react";
import axios from "axios";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import Tilt from "react-parallax-tilt";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import TypingEffect from "./components/TypingEffect";
import BootScreen from "./components/BootScreen";

export default function App() {

  /* BOOT */

  const [booting, setBooting] =
    useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {

      setBooting(false);

    }, 3000);

    return () => clearTimeout(timer);

  }, []);

  /* INPUTS */

  const [sleep, setSleep] =
    useState(7);

  const [study, setStudy] =
    useState(4);

  const [coding, setCoding] =
    useState(4);

  const [screen, setScreen] =
    useState(6);

  /* AI */
/* AI */

const [loading, setLoading] =
  useState(false);

const [speaking, setSpeaking] =
  useState(false);
const [result, setResult] =
  useState(null);
  const resultRef =
  useRef(null);

const [chatHistory, setChatHistory] =
  useState([]);
  useEffect(() => {

  const savedChats =
    localStorage.getItem(
      "oracleMemory"
    );

  console.log(
    "LOADING MEMORY",
    savedChats
  );

  if (savedChats) {

    setChatHistory(
      JSON.parse(savedChats)
    );
  }

}, []);
  useEffect(() => {

  const saved =
    localStorage.getItem(
      "oracleMemory"
    );

  if (saved) {

    setChatHistory(
      JSON.parse(saved)
    );
  }

}, []);
const [userMessage, setUserMessage] =
  useState("");

const [email, setEmail] =
  useState("");

const [password, setPassword] =
  useState("");

const [user, setUser] =
  useState(null);
  useEffect(() => {

  supabase.auth.getUser()

    .then(({ data }) => {

      if (data.user) {

        setUser(data.user);
      }
    });

}, []);
 const [isLogin, setIsLogin] =
  useState(false);

const handleAuth = async () => {

  let response;

  if (isLogin) {

    response =

      await supabase.auth.signInWithPassword({

        email,
        password,

      });

  } else {

    response =

      await supabase.auth.signUp({

        email,
        password,

      });
  }

  const {
    data,
    error,
  } = response;

  if (error) {

    console.log(error);

  } else {

    setUser(data.user);
  }
};
/* MEMORY LOAD */

useEffect(() => {

  const savedChats =
    localStorage.getItem(
      "oracleMemory"
    );

  if (savedChats) {

    setChatHistory(
      JSON.parse(savedChats)
    );
  }

}, []);

/* MEMORY SAVE */

useEffect(() => {

  localStorage.setItem(

    "oracleMemory",

    JSON.stringify(
      chatHistory
    )
  );
    console.log(
    "MEMORY SAVED",
    chatHistory
    );

}, [chatHistory]);

/* VOICE */

const {
  transcript,
  listening,
  resetTranscript,
} = useSpeechRecognition();

const speakMessage = (text) => {

  const speech =
    new SpeechSynthesisUtterance(
      text
    );

  setSpeaking(true);

  speech.onend = () => {

    setSpeaking(false);
  };

  window.speechSynthesis.speak(
    speech
  );
};
/* GENERATE FUTURE */

const generateFuture =
  async () => {

  try {

    setLoading(true);

    const response =
      await axios.post(
        "https://future-os.onrender.com/generate-future",
        {
          sleep,
          study,
          coding,
          screen,
        }
      );

    setResult(
      response.data
    );
    setTimeout(() => {

  resultRef.current?.scrollIntoView({

    behavior: "smooth",

  });

}, 300);

    speakMessage(
      response.data.message
    );

    setLoading(false);

  } catch (error) {

    console.error(error);

    setLoading(false);
  }
};

/* VOICE GENERATE */

const generateFromVoice =
  async () => {

  try {

    console.log(
      "VOICE:",
      transcript
    );

    setLoading(true);

    const response =
      await axios.post(
        "https://future-os.onrender.com/generate-future",
        {
          voiceInput:
            transcript,
        }
      );

    setResult(
      response.data
    );

    const updatedHistory = [

  ...chatHistory,

  {
    type: "user",
    text: transcript,
  },

  {
    type: "oracle",
    text:
      response.data.message,
  },
];

setChatHistory(
  updatedHistory
);

localStorage.setItem(

  "oracleMemory",

  JSON.stringify(
    updatedHistory
  )
);

    speakMessage(
      response.data.message
    );

    setLoading(false);

  } catch (error) {

    console.error(error);

    setLoading(false);
  }
};

/* TEXT MESSAGE */

const sendTextMessage =
  async () => {

  if (!userMessage.trim())
    return;

  try {

    setLoading(true);

    const response =
      await axios.post(
        "https://future-os.onrender.com/generate-future",
        {
          voiceInput:
            userMessage,
        }
      );

    setResult(
      response.data
    );

    setChatHistory((prev) => [

      ...prev,

      {
        type: "user",
        text: userMessage,
      },

      {
        type: "oracle",
        text:
          response.data.message,
      },
    ]);
      
    localStorage.setItem(

  "oracleMemory",

  JSON.stringify(
    chatHistory
  )
);speakMessage(
      response.data.message
    );

    setUserMessage("");

    setLoading(false);

  } catch (error) {

    console.error(error);

    setLoading(false);
  }
};
  /* CHART */

  const chartData = [
    {
      day: "Mon",
      value:
        sleep * 4 +
        coding * 6,
    },

    {
      day: "Tue",
      value:
        sleep * 5 +
        study * 5,
    },

    {
      day: "Wed",
      value:
        coding * 8,
    },

    {
      day: "Thu",
      value:
        study * 7,
    },

    {
      day: "Fri",
      value:
        coding * 9,
    },

    {
      day: "Sat",
      value:
        sleep * 6,
    },

    {
      day: "Sun",
      value:
        study * 4 +
        coding * 4,
    },
  ];

  const inputCards = [
    {
      label: "SLEEP",
      value: sleep,
      set: setSleep,
      color: "text-cyan-300",
      max: 12,
    },

    {
      label: "STUDY",
      value: study,
      set: setStudy,
      color: "text-purple-300",
      max: 12,
    },

    {
      label: "CODING",
      value: coding,
      set: setCoding,
      color: "text-pink-300",
      max: 12,
    },

    {
      label: "SCREEN",
      value: screen,
      set: setScreen,
      color: "text-red-300",
      max: 15,
    },
  ];
const logout = async () => {

  await supabase.auth.signOut();

  setUser(null);
  setChatHistory([]);
setResult(null);

localStorage.removeItem(
  "oracleMemory"
);
};
  if (!user) {

  return (

    <div className="
      min-h-screen
      bg-[#050816]
      flex
      items-center
      justify-center
      px-6
    ">

      <div className="
        w-full
        max-w-md
        bg-black/30
        border
        border-white/10
        rounded-[30px]
        p-8
        backdrop-blur-2xl
      ">

        <h1 className="
          text-4xl
          font-black
          text-center
          bg-gradient-to-r
          from-cyan-300
          to-pink-500
          bg-clip-text
          text-transparent
        ">

          FutureOS

        </h1>

        <p className="
          text-center
          text-white/50
          mt-2
          mb-8
        ">

          Initialize Oracle Access

        </p>

        <div className="
          flex
          flex-col
          gap-4
        ">

          <input

            type="email"

            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            className="
              px-5
              py-4
              rounded-[18px]
              bg-black/30
              border
              border-white/10
              text-white
              outline-none
            "
          />

          <input

            type="password"

            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            className="
              px-5
              py-4
              rounded-[18px]
              bg-black/30
              border
              border-white/10
              text-white
              outline-none
            "
          />

          <button
onClick={() => {

  if (!loading) {

    handleAuth();
  }
}}

            className="
              py-4
              rounded-[18px]
              bg-gradient-to-r
              from-cyan-400
              to-purple-500
              font-semibold
            "
          >

            {isLogin
  ? "LOGIN"
  : "CREATE ACCOUNT"}

          </button>
          <p

  onClick={() =>
    setIsLogin(
      !isLogin
    )
  }

  className="
    text-center
    text-white/50
    text-sm
    cursor-pointer
    mt-2
  "
>

  {isLogin

    ? "Create new account"

    : "Already have an account?"}

</p>

        </div>

      </div>

    </div>
  );
}
  return (

    <>

      {/* BOOT */}

      <AnimatePresence>

        {/* {booting && <BootScreen />} */}

      </AnimatePresence>

      {/* MAIN */}

      <div className="min-h-screen overflow-hidden text-white relative bg-[#050816]">

        {/* BACKGROUND */}

        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[140px]" />

          <div className="absolute top-[-100px] right-[-120px] w-[450px] h-[450px] rounded-full bg-pink-500/20 blur-[140px]" />

          <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-purple-500/20 blur-[180px]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_60%)]" />

        </div>

        {/* PARTICLES */}

        <div className="absolute inset-0 overflow-hidden">

          {[...Array(70)].map((_, i) => (

            <motion.div

              key={i}

              className="absolute rounded-full"

              style={{
                width:
                  Math.random() * 4 + 2,

                height:
                  Math.random() * 4 + 2,

                background:
                  i % 2 === 0
                    ? "#00ffff"
                    : "#ff00aa",

                left:
                  `${Math.random() * 100}%`,

                top:
                  `${Math.random() * 100}%`,

                boxShadow:
                  i % 2 === 0
                    ? "0 0 20px #00ffff"
                    : "0 0 20px #ff00aa",
              }}

              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 1, 0.2],
              }}

              transition={{
                duration:
                  Math.random() * 4 + 4,

                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* CONTENT */}
        <div className="
  absolute
  top-6
  right-6
  z-20
  px-4
  py-3
  rounded-[20px]
  border
  border-white/10
  bg-black/30
  backdrop-blur-2xl
  flex
  items-center
  gap-3
">

  <div className="
    w-3
    h-3
    rounded-full
    bg-cyan-400
    animate-pulse
  " />

  <div>

    <h2 className="
      text-sm
      font-semibold
    ">

      {email || "Oracle User"}

    </h2>

    <p className="
      text-[10px]
      tracking-[0.3em]
      text-cyan-300
    ">

      ONLINE

    </p>

  </div>

</div>

        <div className="relative z-10 flex flex-col items-center px-6 pt-8 pb-10 min-h-screen">

          {/* ORACLE */}

          <motion.div

            animate={{
              y: [0, -10, 0],
            }}

            transition={{
              duration: 4,
              repeat: Infinity,
            }}

            className="relative flex items-center justify-center mb-5"
          >

            <div className="absolute w-[170px] h-[170px] rounded-full bg-purple-500/20 blur-[100px]" />

            <motion.div

              animate={{
                rotate: 360,
              }}

              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}

              className="absolute w-[150px] h-[150px] rounded-full border border-cyan-400/20"
            />

            <motion.div

              animate={{
                rotate: -360,
              }}

              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "linear",
              }}

              className="absolute w-[180px] h-[180px] rounded-full border border-dashed border-pink-400/20"
            />

            <div className="relative w-[72px] h-[72px] rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_70px_rgba(168,85,247,0.5)]">

              <div className="absolute inset-[3px] rounded-full bg-black/60 backdrop-blur-3xl" />

              <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-white/30 blur-sm" />

              <div className="relative z-10 text-center">

                <h2 className="text-white text-[10px] tracking-[0.28em] font-light">

                  ORACLE

                </h2>
<div className="
  mt-1
  flex
  items-center
  justify-center
  gap-1
">

  <div className="
    w-2
    h-2
    rounded-full
    bg-cyan-400
    animate-pulse
  " />

  <p className="
    text-[8px]
    tracking-[0.25em]
    text-cyan-300
  ">

    ONLINE

  </p>

</div>
              </div>

            </div>

          </motion.div>

          {/* TITLE */}

          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-500 bg-clip-text text-transparent">

            FutureOS

          </h1>

          <p className="mt-2 text-gray-400 tracking-[0.4em] text-xs">

            FUTURE INTELLIGENCE SYSTEM
            <button

  onClick={logout}

  className="
    mt-4
    px-6
    py-2
    rounded-full
    border
    border-red-400/20
    bg-red-500/10
    text-red-300
    text-sm
    backdrop-blur-xl
  "
>

  Logout

</button>

          </p>
        
          {/* INPUTS */}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">

            {inputCards.map((item, index) => (

              <Tilt
                key={index}
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                perspective={1200}
                glareEnable={true}
                glareMaxOpacity={0.1}
                scale={1.01}
              >

                <motion.div

                  whileHover={{
                    scale: 1.03,
                    y: -5,
                  }}

                  className="
                    bg-black/30
                    border
                    border-white/10
                    rounded-[24px]
                    p-4
                    backdrop-blur-2xl
                    shadow-[0_0_30px_rgba(0,255,255,0.05)]
                  "
                >

                  <h2
                    className={`${item.color} tracking-[0.3em] text-xs mb-5`}
                  >

                    {item.label}

                  </h2>

                  <input
                    type="range"
                    min="0"
                    max={item.max}
                    value={item.value}
                    onChange={(e) =>
                      item.set(e.target.value)
                    }
                    className="w-full accent-cyan-400"
                  />

                  <h1 className="text-3xl font-bold mt-4">

                    {item.value}h

                  </h1>

                </motion.div>

              </Tilt>
            ))}
          </div>

          {/* BUTTON */}

{/* BUTTON */}

<motion.button

  whileHover={{
    scale: 1.05,
  }}

  whileTap={{
    scale: 0.95,
  }}

  onClick={() => {

    if (listening) {

      SpeechRecognition.stopListening();

      setTimeout(() => {

        if (
          transcript
            .toLowerCase()
            .includes("repeat")
        ) {

          if (result?.message) {

            speakMessage(
              result.message
            );
          }

        } else {

          console.log(
            "RUNNING VOICE"
          );

          generateFromVoice();
        }

      }, 800);

    } else {

      resetTranscript();

      SpeechRecognition.startListening({
        continuous: true,
      });
    }
  }}

  className="
    relative
    mt-5
    w-[70px]
    h-[70px]
    rounded-full
    border
    border-cyan-400/20
    bg-black/30
    backdrop-blur-2xl
    flex
    items-center
    justify-center
    shadow-[0_0_40px_rgba(0,255,255,0.15)]
    overflow-visible
  "
>

  {(listening || speaking) && (

    <motion.div

      animate={{
        scale: [1, 2.2],
        opacity: [0.6, 0],
      }}

      transition={{
        duration: 1.5,
        repeat: Infinity,
      }}

      className="
        absolute
        w-full
        h-full
        rounded-full
        border
        border-cyan-400
      "
    />
  )}

  <motion.div

    animate={
      speaking
        ? {
            scale: [1, 1.15, 1],
            opacity: [1, 0.7, 1],
          }
        : {}
    }

    transition={{
      duration: 1,
      repeat: Infinity,
    }}

    className="
      text-3xl
      relative
      z-10
    "
  >

    🎤

  </motion.div>

</motion.button>
<motion.button

  whileHover={{
    scale: 1.04,
  }}

  whileTap={{
    scale: 0.96,
  }}

  onClick={
    generateFuture
  }

  className="
    mt-8
    px-10
    py-4
    rounded-[22px]
    bg-gradient-to-r
    from-cyan-400
    via-purple-500
    to-pink-500
    text-white
    font-semibold
    tracking-[0.25em]
    shadow-[0_0_50px_rgba(168,85,247,0.4)]
  "
>

  {loading
    ? "SCANNING FUTURE..."
    : "GENERATE FUTURE"}

</motion.button>
{/* TRANSCRIPT */}
  {transcript && (

            <motion.div

              initial={{
                opacity: 0,
                y: 20,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              className="
                mt-4
                w-full
                max-w-2xl
                rounded-[20px]
                border
                border-white/10
                bg-black/20
                backdrop-blur-2xl
                p-4
                text-white/70
                text-sm
              "
            >

              {transcript}

            </motion.div>
          )}

          {/* ANALYTICS */}

          {result && (
<div
  ref={resultRef}
  className="
    w-full
    flex
    justify-center
  "
>

            <motion.div

              initial={{
                opacity: 0,
                y: 40,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              className="
                mt-8
                w-full
                max-w-4xl
                rounded-[28px]
                border
                border-white/10
                bg-black/30
                backdrop-blur-2xl
                p-6
                shadow-[0_0_80px_rgba(168,85,247,0.12)]
                overflow-hidden
                relative
              "
            >

              <div className="absolute top-[-100px] right-[-100px] w-[220px] h-[220px] rounded-full bg-cyan-500/10 blur-[100px]" />

              {/* HEADER */}

              <div className="flex items-center justify-between mb-8 relative z-10">

                <div>

                  <h2 className="text-xl font-bold">

                    Future Analytics

                  </h2>

                  <p className="text-xs tracking-[0.35em] text-white/40 mt-1">

                    LIVE PRODUCTIVITY MATRIX

                  </p>

                </div>

                <motion.div

                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}

                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}

                  className="w-3 h-3 rounded-full bg-cyan-400"
                />

              </div>

              {/* METRICS */}

              <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">

                <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">

                  <p className="text-cyan-300 text-[10px] tracking-[0.3em]">

                    OUTPUT

                  </p>

                  <h1 className="mt-3 text-2xl font-black text-cyan-300">

                    {coding * 12}

                  </h1>

                </div>

                <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">

                  <p className="text-purple-300 text-[10px] tracking-[0.3em]">

                    FOCUS

                  </p>

                  <h1 className="mt-3 text-2xl font-black text-purple-300">

                    {result.stats.focusScore}

                  </h1>

                </div>

                <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">

                  <p className="text-pink-300 text-[10px] tracking-[0.3em]">

                    ENERGY

                  </p>

                  <h1 className="mt-3 text-2xl font-black text-pink-300">

                    {sleep * 10}

                  </h1>

                </div>

              </div>

              {/* PREMIUM CHART */}

              <div className="relative w-full h-[280px] overflow-hidden rounded-[24px]">

                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-[24px]" />

                <div className="absolute top-[-80px] right-[-80px] w-[200px] h-[200px] rounded-full bg-cyan-500/10 blur-[80px]" />

                <div className="absolute bottom-[-100px] left-[-100px] w-[240px] h-[240px] rounded-full bg-purple-500/10 blur-[90px]" />

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart
                    data={chartData}
                  >

                    <defs>

                      <linearGradient
                        id="futureGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >

                        <stop
                          offset="0%"
                          stopColor="#00ffff"
                        />

                        <stop
                          offset="50%"
                          stopColor="#a855f7"
                        />

                        <stop
                          offset="100%"
                          stopColor="#ff00aa"
                        />

                      </linearGradient>

                    </defs>

                    <Tooltip

                      contentStyle={{
                        background:
                          "rgba(10,10,20,0.95)",

                        border:
                          "1px solid rgba(255,255,255,0.08)",

                        borderRadius: "16px",

                        color: "white",

                        backdropFilter:
                          "blur(10px)",

                        boxShadow:
                          "0 0 30px rgba(0,255,255,0.1)",
                      }}
                    />

                    <Line

                      type="monotone"

                      dataKey="value"

                      stroke="url(#futureGradient)"

                      strokeWidth={5}

                      dot={{
                        r: 5,
                        fill: "#00ffff",
                        strokeWidth: 2,
                        stroke: "#ffffff",
                      }}

                      activeDot={{
                        r: 9,
                        fill: "#ffffff",
                      }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </motion.div>
            </div>
          )}
{/* CHAT HISTORY */}

{chatHistory.length > 0 && (

  <motion.div

    initial={{
      opacity: 0,
      y: 40,
    }}

    animate={{
      opacity: 1,
      y: 0,
    }}

    className="
      mt-8
      w-full
      max-w-4xl
      rounded-[28px]
      border
      border-white/10
      bg-black/30
      backdrop-blur-2xl
      p-6
      shadow-[0_0_80px_rgba(168,85,247,0.12)]
    "
  >

    <div className="flex items-center justify-between mb-6">

      <div>

        <h2 className="text-xl font-bold">

          Oracle Conversation

        </h2>

        <p className="text-xs tracking-[0.3em] text-white/40 mt-1">

          LIVE AI MEMORY STREAM

        </p>

      </div>

      <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />

    </div>

    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">

      {chatHistory.map((chat, index) => (

        <motion.div

          key={index}

          initial={{
            opacity: 0,
            x:
              chat.type === "user"
                ? 40
                : -40,
          }}

          animate={{
            opacity: 1,
            x: 0,
          }}

          className={`
            p-4
            rounded-[20px]
            border
            backdrop-blur-xl
            ${
              chat.type === "user"

                ? `
                  ml-auto
                  max-w-[75%]
                  bg-cyan-500/10
                  border-cyan-400/20
                  text-cyan-100
                `

                : `
                  mr-auto
                  max-w-[75%]
                  bg-purple-500/10
                  border-purple-400/20
                  text-purple-100
                `
            }
          `}
        >

          <p className="text-xs tracking-[0.25em] opacity-60 mb-2">

            {chat.type === "user"
              ? "YOU"
              : "ORACLE"}

          </p>

          <p className="leading-relaxed">

            {chat.text}

          </p>

        </motion.div>
      ))}
    </div>

  </motion.div>
)}
{/* TEXT CHAT */}

<div
  className="
    mt-6
    w-full
    max-w-4xl
    flex
    gap-4
  "
>

  <input

    type="text"

    value={userMessage}

    onChange={(e) =>
      setUserMessage(
        e.target.value
      )
    }
onKeyDown={(e) => {

  if (e.key === "Enter") {

    sendTextMessage();
  }
}}
    placeholder="Message Oracle..."

    className="
      flex-1
      bg-black/30
      border
      border-white/10
      rounded-[20px]
      px-5
      py-4
      text-white
      outline-none
      backdrop-blur-2xl
    "
  />

  <button

    onClick={
      sendTextMessage
    }

    className="
      px-8
      rounded-[20px]
      bg-gradient-to-r
      from-cyan-400
      to-pink-500
      font-semibold
    "
  >

    SEND

  </button>

</div>
          {/* MESSAGE */}

          {result && (

            <motion.div

              initial={{
                opacity: 0,
                y: 40,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              className="
                mt-8
                w-full
                max-w-4xl
                rounded-[24px]
                border
                border-white/10
                bg-black/30
                backdrop-blur-2xl
                p-5
                shadow-[0_0_60px_rgba(168,85,247,0.15)]
              "
            >

              <h2 className="text-lg font-bold mb-4">

                Message From Future You

              </h2>

              <TypingEffect
  text={result.message}
/>

            </motion.div>
          )}

        </div>

      </div>

    </>
  );
  }