import Groq from "groq-sdk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const groq = new Groq({

  apiKey:
    process.env.GROQ_API_KEY,

});
let lastConversation = "";

app.use(cors());
app.use(express.json());

function randomItem(array) {

  return array[
    Math.floor(
      Math.random() * array.length
    )
  ];
}

app.get("/", (req, res) => {

  res.send(
    "FutureOS AI Running"
  );
});

/* =========================
   GENERATE FUTURE
========================= */

app.post(
  "/generate-future",
  async (req, res) => {

    try {

      const {
        sleep,
        study,
        coding,
        screen,
        voiceInput,
      } = req.body;

      /* =========================
         VOICE MODE
      ========================= */

      if (voiceInput) {

        const input =
          voiceInput.toLowerCase();

        let aiReply = "";

        /* HOW ARE YOU */

        if (
          input.includes("how are you")
        ) {

          aiReply =
            "I'm doing great actually. What about you?";

          lastConversation =
            "asked_how_are_you";
        }

        /* USER REPLY */

        else if (

          lastConversation ===
            "asked_how_are_you"

          &&

          (
            input.includes("fine") ||
            input.includes("good") ||
            input.includes("great")
          )

        ) {

          aiReply =
            "That's excellent to hear. Your energy feels positive today. Let's analyze your current status and future growth.";

          lastConversation =
            "";
        }

        /* WHO ARE YOU */

        else if (
          input.includes("who are you")
        ) {

          aiReply =
            "I'm Oracle, your AI assistant inside FutureOS.";
        }

        /* HELLO */

        else if (
          input.includes("hello")
        ) {

          aiReply =
            "Hello. It's nice talking with you.";
        }

        /* HI */

        else if (
          input.includes("hi")
        ) {

          aiReply =
            "Hi. How has your day been so far?";
        }

        /* THANK YOU */

        else if (
          input.includes("thank you")
        ) {

          aiReply =
            "You're welcome.";
        }

        /* GOOD MORNING */

        else if (
          input.includes("good morning")
        ) {

          aiReply =
            "Good morning. I hope your day goes well.";
        }

        /* GOOD NIGHT */

        else if (
          input.includes("good night")
        ) {

          aiReply =
            "Good night. Get proper rest and recharge.";
        }

        /* MOTIVATE */

        else if (
          input.includes("motivate")
        ) {

          aiReply =
            "Discipline compounds faster than motivation. Keep building even on difficult days.";
        }

        /* TIRED */

        else if (
          input.includes("tired")
        ) {

          aiReply =
            "Rest strategically, then continue stronger. Burnout destroys consistency.";
        }

        /* FUTURE */

        else if (
          input.includes("future")
        ) {

          aiReply =
            "Your future is being shaped by the habits you repeat daily.";
        }

        /* DEFAULT */

        else {

          aiReply =
            "Interesting input detected. Oracle is continuously evolving conversational intelligence.";
        }

        return res.json({

          message: aiReply,

          stats: {

            focusScore: 88,

            burnoutLevel:
              "LOW",

            growthLevel:
              "ELITE",
          },
        });
      }

      /* =========================
         SCORES
      ========================= */

      let focusScore =
        sleep * 10 -
        screen * 3;

      let disciplineScore =
        study * 10 +
        coding * 10;

      let burnoutScore =
        screen * 10 -
        sleep * 5;

      /* LIMITS */

      focusScore = Math.max(
        0,
        Math.min(
          100,
          focusScore
        )
      );

      disciplineScore =
        Math.max(
          0,
          Math.min(
            100,
            disciplineScore
          )
        );

      burnoutScore =
        Math.max(
          0,
          Math.min(
            100,
            burnoutScore
          )
        );

      /* =========================
         LEVELS
      ========================= */

      let growthLevel = "";
      let burnoutLevel = "";

      if (
        disciplineScore >= 80
      ) {

        growthLevel =
          "Elite";

      } else if (
        disciplineScore >= 60
      ) {

        growthLevel =
          "Strong";

      } else if (
        disciplineScore >= 40
      ) {

        growthLevel =
          "Growing";

      } else {

        growthLevel =
          "Weak";
      }

      if (
        burnoutScore >= 70
      ) {

        burnoutLevel =
          "High";

      } else if (
        burnoutScore >= 40
      ) {

        burnoutLevel =
          "Medium";

      } else {

        burnoutLevel =
          "Low";
      }

      /* =========================
         DYNAMIC MESSAGE
      ========================= */

      const intros = [

        "Mate,",

        "Folk,",

        "Mate, honestly",

        "Folk, listen",
      ];

      const endings = [

        "Lock in now and your future can seriously change.",

        "A few disciplined months can completely transform your future.",

        "Don't waste the potential you're already building.",

        "Stay consistent and you'll outgrow most folk around you.",
      ];

      let focusText = "";
      let growthText = "";
      let burnoutText = "";

      /* FOCUS */

      if (
        focusScore >= 70
      ) {

        focusText =
          randomItem([

            "your focus is becoming sharp",

            "your mental clarity is improving",

            "your routine is strengthening your focus",
          ]);

      } else if (
        focusScore >= 40
      ) {

        focusText =
          randomItem([

            "your focus is inconsistent",

            "your distractions are slowing you down",

            "your routine still needs balance",
          ]);

      } else {

        focusText =
          randomItem([

            "your habits are damaging your focus",

            "your low sleep and distractions are hurting your growth",

            "your mental energy is getting drained",
          ]);
      }

      /* GROWTH */

      if (
        growthLevel === "Elite"
      ) {

        growthText =
          randomItem([

            "you’re building elite potential",

            "your discipline is putting you far ahead",

            "you’re becoming seriously internship-ready",
          ]);

      } else if (
        growthLevel === "Strong"
      ) {

        growthText =
          randomItem([

            "you’ve got strong potential",

            "your consistency is improving fast",

            "you’re growing faster than most folk",
          ]);

      } else if (
        growthLevel === "Growing"
      ) {

        growthText =
          randomItem([

            "you’re improving slowly",

            "your growth still needs consistency",

            "you have potential but need more discipline",
          ]);

      } else {

        growthText =
          randomItem([

            "your effort is too inconsistent",

            "you’re wasting too much potential",

            "your future depends on building better habits now",
          ]);
      }

      /* BURNOUT */

      if (
        burnoutLevel === "High"
      ) {

        burnoutText =
          "Your burnout risk is high right now.";

      } else if (
        burnoutLevel === "Medium"
      ) {

        burnoutText =
          "Your burnout risk is manageable but rising.";

      } else {

        burnoutText =
          "Your burnout risk is currently low.";
      }

      /* FINAL MESSAGE */

      const finalMessage = `
${randomItem(intros)} ${focusText}. ${growthText}. ${burnoutText} ${randomItem(endings)}
`;

      /* RESPONSE */
const completion =
  await groq.chat.completions.create({

    messages: [

      {
        role: "system",

       content: `
You are Oracle AI from FutureOS.

You combine:
- futuristic predictions
- intelligent conversation
- emotional awareness
- productivity analysis

If the user asks normal questions:
respond conversationally.

If the user asks about future, goals, habits, productivity, success, coding, routines, or life direction:
give futuristic predictive analysis.

Do not sound like a therapist.

Do not constantly ask follow-up questions.
Avoid unrealistic sci-fi claims or random future inventions.
Keep predictions believable and grounded.

Keep replies:
- futuristic
- concise
- cinematic
- intelligent
- confident

User said:
${voiceInput}

Future context:
${finalMessage}
`, 
      },
    ],

    model:
      "llama-3.3-70b-versatile",

  });

const aiReply =
  completion.choices[0]
    .message.content;
      res.json({

        message:aiReply,
          finalMessage,

        stats: {

          focusScore,

          disciplineScore,

          burnoutScore,

          growthLevel,

          burnoutLevel,
        },
      });

    } catch (error) {

      console.error(
        "SERVER ERROR:",
        error
      );

      res.status(500).json({

        error:
          "FutureOS failed",
      });
    }
  }
);

/* =========================
   START SERVER
========================= */

app.listen(5001, () => {

  console.log(
    "FutureOS server running on port 5001"
  );
});