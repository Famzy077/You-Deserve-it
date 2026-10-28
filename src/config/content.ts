export interface TributeElement {
  id: string;
  tag: string;
  title: string;
  preview: string;
  message: string;
  color: string;
  accentColor: string;
}

export interface ExperienceContent {
  recipientName: string;
  senderSignature: string;
  scene1: {
    badge: string;
    headline: string;
    supporting: string;
    button: string;
  };
  scene2: {
    headline: string;
    subhead: string;
    pauseText: string;
    button: string;
  };
  scene3: {
    badge: string;
    title: string;
    subtitle: string;
    elements: TributeElement[];
    completedPrompt: string;
    button: string;
  };
  scene4: {
    badge: string;
    envelopePrompt: string;
    letter: {
      salutation: string;
      paragraphs: string[];
      signoff: string;
      signature: string;
    };
    button: string;
  };
  scene5: {
    badge: string;
    headline: string;
    subhead: string;
    followUp: string;
    button: string;
  };
  scene6: {
    badge: string;
    headline: string;
    subhead: string;
    finalQuote: string;
    buttonRepeat: string;
    buttonKeepReminder: string;
    reminderCard: {
      title: string;
      body: string;
      bullets: string[];
      closing: string;
    };
  };
}

export const defaultContent: ExperienceContent = {
  recipientName: "Momma ❤️",
  senderSignature: "Oluwafemi ❤️",

  scene1: {
    badge: "For Someone Rare & Cherished",
    headline: "Some things deserve to be said properly.",
    supporting: "So I made this little space just for you.",
    button: "Come closer, my love",
  },

  scene2: {
    headline: "You deserve your flowers.",
    subhead: "Not just for what you achieved, but for the heart you put into trying.",
    pauseText: "I saw the effort. I saw you trying. And I want you to know that it mattered.",
    button: "Step into the night garden",
  },

  scene3: {
    badge: "A Tribute To You",
    title: "The Garden of What You Gave",
    subtitle: "Touch each luminous blossom to uncover the things I never want you to forget.",
    elements: [
      {
        id: "effort",
        tag: "01",
        title: "Your Effort",
        preview: "The dedication and energy you brought each morning",
        message:
          "I hope you give yourself credit for how much you tried, how much you gave, and how seriously you took what you were doing. I see that effort, and I appreciate it.",
        color: "#E9A5B5",
        accentColor: "#681C35",
      },
      {
        id: "strength",
        tag: "02",
        title: "Your Strength",
        preview: "The poise and resilience you held through every uncertainty",
        message:
          "I know it may not feel easy to close this chapter. But I hope you remember that one difficult ending cannot erase everything you have learned, contributed, or become.",
        color: "#D4AF75",
        accentColor: "#8E6527",
      },
      {
        id: "worth",
        tag: "03",
        title: "Your Worth",
        preview: "The boundless value that no job title could ever measure",
        message:
          "Your worth was never limited to one workplace, one role, or one company’s ability to continue. You have so much more to offer, and I hope the next chapter gives you more room to show it.",
        color: "#FFF0E4",
        accentColor: "#D4AF75",
      },
    ],
    completedPrompt: "You have uncovered all three blooms.",
    button: "I wrote something for you",
  },

  scene4: {
    badge: "From My Heart",
    envelopePrompt: "Touch the golden star to open",
    letter: {
      salutation: "My love,",
      paragraphs: [
        "I just want you to know how proud I am of you.",
        "I know you gave this chapter a genuine effort. You showed up, you tried, and you put something of yourself into what you were doing. Even though things have not turned out the way you might have hoped, I never want you to think that your effort was for nothing.",
        "Sometimes a chapter ends for reasons that have nothing to do with how capable or deserving we are. A company closing does not take away your talent, your experience, your potential, or the person you are becoming.",
        "I hope you give yourself permission to breathe, reflect, and be proud of yourself. You do not need to figure out every next step immediately. You are allowed to take your time and find something that recognizes your value.",
        "I genuinely believe there are better opportunities ahead of you. I cannot promise that every step will be easy, but I believe in your ability to grow, find your place, and do wonderful things with what you have learned.",
        "And through all of this, please remember that you are not defined by a job title, a company, or an ending.",
        "I see you. I appreciate you. I am proud of you. And I am always rooting for you.",
        "You deserve to be valued, supported, and given room to become everything you are capable of being.",
      ],
      signoff: "With all my love,",
      signature: "Oluwafemi ❤️",
    },
    button: "Ready for the next little reminder?",
  },

  scene5: {
    badge: "The Dawn of Tomorrow",
    headline: "This is not the end of your story.",
    subhead: "It is simply the end of one chapter.",
    followUp:
      "And I hope the next one brings you closer to the opportunities, recognition, peace, and happiness you deserve.",
    button: "A final thought",
  },

  scene6: {
    badge: "Carried In Your Heart",
    headline: "Whatever comes next, I hope you never forget how much you have to offer.",
    subhead: "I believe in you. I am proud of you. And I will keep rooting for you.",
    finalQuote: "Your next chapter is still yours to write. ❤️",
    buttonRepeat: "Experience it again",
    buttonKeepReminder: "Keep this reminder close",
    reminderCard: {
      title: "You Deserve Your Flowers",
      body: "A gentle reminder for the days you need to hear it most:",
      bullets: [
        "One ending cannot erase everything you have learned, contributed, or become.",
        "Your worth was never limited to one company, one role, or one season.",
        "You don't need to have every next step figured out today. Give yourself room to breathe.",
        "You gave genuine heart and effort, and that will always matter.",
        "The people who love you see how capable you are.",
      ],
      closing: "Your next chapter is still yours to write. With all my love, always.",
    },
  },
};
