## Inspiration

Sexual health is deeply personal, yet many tools that exist today are either overly clinical, stigmatizing, or just not designed with real people's experiences in mind — especially queer, trans, and non-monogamous communities. Most health apps like Apple Health and Flo offer limited or no tools that let users track sexual activity or STI risks— leaving a major gap in sexual wellness tools. Meanwhile, during Trump’s attacks on DEI efforts, critical public health data — including HIV stats — disappeared from government websites, making it harder for people to access accurate, inclusive information.

We wanted to create something that feels safe, discreet, and affirming — a soft space for people to track their sexual activity, monitor STI risk, and feel empowered in their health journey. The name Cocoon reflects this transformation: a protective environment where people can grow, heal, and take control of their bodies without judgment.

## What it does

Privately log sexual encounters on your device — including date, partner, protection used, and types of activity — with no cloud storage or tracking.

Track symptoms related to sexual health or overall well-being, and monitor changes over time.

Get personalized STI testing recommendations based on your activity, timing, and risk level.

Store key profile info like contraceptive use, PrEP/PEP status, and past test results.

Receive non-judgmental insights and resources, including nearby clinics tailored to your location.

## How we built it

Cocoon was built using React and React Native, leveraging the Expo Router for navigation and AsyncStorage for local data persistence to prioritize user privacy. We used React hooks and context (useOnboarding) to manage state across the app, and developed modular UI components like HealthMetrics, WeeklyCalendar, and DashboardItem to create a clean, accessible experience. Icons were provided by @expo/vector-icons to maintain visual consistency throughout the interface.

## Challenges we ran into

One of the trickiest parts was handling calendar transitions — shifting between weekly and monthly views proved buggy and inconsistent across devices. We also faced challenges structuring the logging system in React, especially making sure data persisted without compromising privacy or UX flow. Debugging local storage and getting AsyncStorage to sync correctly with context data took some time.

## Accomplishments that we're proud of

We’re incredibly proud that we were able to design and build a working, original, and impactful app in just one night. Cocoon isn’t just functional — it’s a project we truly believe can help people. It feels like the beginning of something meaningful.

## What we learned

We learned that user experience and trust should always come first, especially when designing tools that deal with sensitive topics like sexual health. We gained a deeper appreciation for privacy-first development and the importance of thoughtful, inclusive design when trying to destigmatize care and promote wellness.

## What's next for cocoon

User testing with real people to refine the design and features

Adding risk-based STI notifications and reminders

Expanding the symptom logging interface and educational content

Improving the dashboard with visual insights and analytics
