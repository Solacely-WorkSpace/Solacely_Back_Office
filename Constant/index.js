import {
  testimonialImageFive,
  testimonialImageFour,
  testimonialImageOne,
  testimonialImageThree,
  testimonialImageTwo,
  tourImageOne,
  tourImageTwo,
  tourImagethree,
  tourImageFour,
} from "@/assets/images"

import { memberOne, memberTwo, memberThree, memberFour, memberFive, memberSix, memberSeven, memberEight, memberNine, memberTen } from '@/assets/images'

// Testimonial Dataset
const Testimonial = [{
  username: '- @Anthony_Agah',
  testimony: 'Finding an apartment that suits your needs, budget, and appeals to your taste is a full-blown job. Most times the pictures or video shared by agents are not as cool as it seems in reality. This is why I’m as it seems in reality. This is why I’m particularly proud of what the @Solacelybeta team is building.',
  social: '/icons/linkedin.svg',
  pic: testimonialImageOne

},
{
  username: ' - @JamiuOkanlawon',
  testimony: "It’s always to see how technology is impacting the most important aspect is that I can earn while I rent without stress, just some surveys and tasks, and it comes to my wallet on solacely. Great job, team @solacelybeta",
  social: '/icons/linkedin.svg',
  pic: testimonialImageTwo

},
{
  username: ' - @Real_Ija',
  testimony: 'House hunting in Naija is difficult and expensive. Normally, expensive things should not be difficult. @SolacelyAR is working on ensuring you find solace in house hunting. The goal is for you to pay and get the keys. No bottlenecks!',
  social: '/icons/linkedin.svg',
  pic: testimonialImageThree

},
{
  username: '- @_olaomoriwo',
  testimony: 'I spent quality time studying what #SolacelyAR is doing for the proptech industry, I have so much confidence this solution will scale. Really anticipating the innovation and processes that’ll make this innovation and processes that’ll make this fly.',
  social: '/icons/linkedin.svg',
  pic: testimonialImageFour

},
{
  username: ' - @khadijjahhh',
  testimony: 'I am really excited to see @SolacelyAR come to life.',
  social: '/icons/linkedin.svg',
  pic: testimonialImageFive
},
  // {
  //     username: ' - @thepatwalls',
  //     testimony: ' There Homes Are Top Notch Cant See Me Changing Location Anytime Soon, Best Home PLug.',
  //     social: '/icons/linkedin.svg',
  //     pic: '/images/pat.jpg'

  // },

]

// What We Offer Dataset

const whatWeOffer = [
  {
    offer: 'Our AI-driven system understands your needs and delivers property recommendations tailored to your preferences, budget, and lifestyle.',
    icon: '/icons/star.svg',
    header: 'Personalized Property Matching'

  },
  {
    offer: 'We eliminate the guesswork by ensuring every property on our platform is verified with secure digital records and transparent ownership history.',
    icon: '/icons/leaf.svg',
    header: 'Verified & Secure Transactions'

  },
  {
    offer: 'Enjoy post-transaction services, including maintenance tracking, legal documentation, and ongoing property insights.',
    icon: '/icons/cirle.svg',
    header: 'Property Management Tools'

  },
  {
    offer: 'Make informed decisions with real-time property value estimations and AI-powered investment analytics',
    icon: '/icons/icon.svg',
    header: 'Data-Driven Market Insights'

  },

]

const aboutOffers = [
  {
    offer: 'We believe everyone deserves to know exactly what they’re getting. From verified listings to escrow-secured transactions, we eliminate guesswork and build confidence between tenants, landlords, and agents.',
    icon: '/icons/star.svg',
    header: 'Trust & Transparency'

  },
  {
    offer: 'We don’t just help you rent, we help you grow. Tenants can build credit, earn rewards, and gain access to financial tools that support long-term stability. Partners benefit from improved rent collection, lower vacancy rates, and predictable income streams.',
    icon: '/icons/leaf.svg',
    header: 'Financial Empowerment'

  },
  {
    offer: 'From low-income earners to gig workers, we’re creating a housing ecosystem where no one is left out. Our AI-powered recommendation engine ensures personalized property matches, no matter your income or background.',
    icon: '/icons/Icon.svg',
    header: 'Access for All'

  },
  {
    offer: 'We’re not here to tweak the old system, we’re here to build a better one. Solacely fosters a culture of constant learning, feedback, and co-creation. We listen, iterate, and evolve with our users, not just for them.',
    icon: '/icons/cirle.svg',
    header: 'Community & Innovation'

  },

]

// Tour Dataset

const tour = {
  apartment: {
    label: "Apartment",
    header: "Discover Apartments from Anywhere, Anytime",
    desc: "Explore your next apartment like never before—right from your device. With Solacely, you can view curated spaces and their surroundings using real-time, AI-enhanced recommendations.",
    src: tourImageOne,
  },

  "Co-Living Space": {
    label: "Co-Living Space",
    header: "Live Better, Together",
    desc: `Discover modern co-living spaces designed for connection, comfort, and community. Whether you're a remote worker, student, or creative, Solacely pairs you with shared homes that match your lifestyle and values.`,
    src: tourImageTwo,
  },

  "Pair With Me": {
    label: "Pair With Me",
    header: "Find the Perfect Roommate for Your Next Home",
    desc: `Looking for someone to share rent, responsibilities, and maybe a few laughs? Solacely helps you connect with verified, compatible co-tenants based on your preferences, habits, and goals. `,
    src: tourImagethree,
  },

  "Real Estate": {
    label: "Real Estate",
    header: "Smart Tools for Property Owners & Agents",
    desc: `List, manage, and earn more from your properties with Solacely’s AI-powered tools and secure blockchain infrastructure.
List verified properties quickly
Get tenant matches automatically
Escrow-backed payments & fraud protection`,
    src: tourImageFour,
  },
}

const teamMembers = [
  {
    name: "Akinrodolu Oluwaseun ",
    location: "Lagos, NG",
    role: "Founder & Senior PM",
    image: memberOne,
    social: {
      instagram: "https://instagram.com/username",
      linkedin: "https://www.linkedin.com/in/akinrodoluseun/",
      facebook: "https://facebook.com/username",
      twitter: "https://twitter.com/Akinrodoluseun"
    }
  },
  {
    name: "Oware M. Paul",
    location: "Lagos, NG",
    role: "Co-founder & COO",
    image: memberTwo,
    social: {
      instagram: "https://instagram.com/username",
      linkedin: "https://linkedin.com/in/username",
      facebook: "https://facebook.com/username",
      twitter: "https://twitter.com/username"
    }
  },
  {
    name: "Mathew Emmanuel ",
    location: "Lagos, NG",
    role: "Backend Engineer",
    image: memberThree,
    social: {
      instagram: "https://instagram.com/username",
      linkedin: "https://linkedin.com/in/username",
      facebook: "https://facebook.com/username",
      twitter: "https://twitter.com/username"
    }
  },
  {
    name: "Thomas Tochukwu Christian ",
    location: "Lagos, NG",
    role: "Frontend Developer",
    image: memberFour,
    social: {
      instagram: "https://instagram.com/username",
      linkedin: "https://linkedin.com/in/username",
      facebook: "https://facebook.com/username",
      twitter: "https://twitter.com/username"
    }
  },
  {
    name: "Ojo Favour Osuare",
    location: "Lagos, NG",
    role: "UI/UX Designer",
    image: memberFive,
    social: {
      instagram: "https://instagram.com/username",
      linkedin: "https://linkedin.com/in/username",
      facebook: "https://facebook.com/username",
      twitter: "https://twitter.com/username"
    }
  },
  {
    name: "N. Barrack Okoth",
    location: "Nairobi, Kenya",
    role: "Frontend Developer",
    image: memberSix,
    social: {
      instagram: "https://instagram.com/username",
      linkedin: "https://linkedin.com/in/username",
      facebook: "https://facebook.com/username",
      twitter: "https://twitter.com/username"
    }
  },
  
  {
    name: "Ndubuisi Juliet Ijeoma",
    location: "Lagos, NG",
    role: "Product Manager",
    image: memberSeven,
    social: {
      instagram: "https://instagram.com/username",
      linkedin: "https://linkedin.com/in/username",
      facebook: "https://facebook.com/username",
      twitter: "https://twitter.com/username"
    }
  },
  {
    name: "Lawrence Chibondo",
    location: "Lagos, NG",
    role: "Software Engineer",
    image: memberNine,
    social: {
      instagram: "https://instagram.com/username",
      linkedin: "https://linkedin.com/in/username",
      facebook: "https://facebook.com/username",
      twitter: "https://twitter.com/username"
    }
  },
  {
    name: "Aubrey Nyasulu",
    location: "Lagos, NG",
    role: "Frontend Developer",
    image: memberEight,
    social: {
      instagram: "https://instagram.com/username",
      linkedin: "https://linkedin.com/in/username",
      facebook: "https://facebook.com/username",
      twitter: "https://twitter.com/username"
    }
  },
  
  {
    name: "Orji Miracle ",
    location: "Lagos, NG",
    role: "UI/UX Designer",
    image: memberTen,
    social: {
      instagram: "https://instagram.com/username",
      linkedin: "https://linkedin.com/in/username",
      facebook: "https://facebook.com/username",
      twitter: "https://twitter.com/username"
    }
  },
]

// Animation Constants

const slideInLeft = {
  hidden: { opacity: 0, x: -200 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } }
}

const fadeIn = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1 } }
}


const slideInRight = {
  hidden: { opacity: 0, x: 200 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } }
}

const enterFrame = {
  hidden: { opacity: 0, y: '-100vw' },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 125, staggerChildren: 0.3 } }
}

const btn = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 }
}

export {
  Testimonial,
  whatWeOffer,
  aboutOffers,
  teamMembers,
  fadeIn,
  enterFrame,
  slideInLeft,
  slideInRight,
  btn,
  tour,
}