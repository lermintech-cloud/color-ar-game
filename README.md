# 🎨 Color Hunter - Thai Color Learning Game

An interactive browser-based educational game designed for Grade 2 students to learn Thai color vocabulary through real-time hand tracking.

## Features

### Gameplay
- **Real-time Hand Tracking**: Uses MediaPipe to detect hand landmarks and track the index finger as a cursor
- **6 Colorful Circles**: Randomly positioned circles in vibrant colors
- **Thai Instructions**: Audio and visual prompts in Thai (e.g., "แตะสีแดง" - "Touch red")
- **Hold-to-Select**: Hold your index finger over a circle for 0.5 seconds to select it
- **Instant Feedback**: Success animations, confetti effects, and sound effects

### Game Mechanics
- **60-Second Timer**: Fast-paced gameplay with time pressure
- **Score System**: Points increase with level progression (10 × level per correct answer)
- **Level System**: Advance levels every 5 correct answers
- **Accuracy Tracking**: Real-time accuracy percentage display
- **Progress Bar**: Visual timer progress indicator

### Visual Design
- **Animated Gradient Background**: Eye-catching, playful color transitions
- **Floating Bubbles**: Cute decorative elements
- **Hand Skeleton Overlay**: Visual display of detected hand landmarks
- **Smooth Animations**: Transitions, scale effects, and shake animations
- **Responsive Layout**: Works on desktop and tablet devices

### Audio Features
- **Sound Effects**: Success beeps and wrong answer tones
- **Thai Text-to-Speech**: Automatic pronunciation of color names after correct selections
- **Adjustable Speech Rate**: Optimized for young learners

### Controls
- **Play Button**: Start or restart the game
- **Fullscreen Mode**: Immersive gameplay experience
- **Play Again Button**: Quick restart after game ends

## Thai Colors Taught

1. 🔴 **แดง** (Daeng) - Red
2. 🟢 **เขียว** (Kiao) - Green
3. 🟡 **เหลือง** (Leung) - Yellow
4. 🔵 **น้ำเงิน** (Nam-Ngoen) - Blue
5. 🟣 **ม่วง** (Muang) - Purple
6. 🩷 **ชมพู** (Chompoo) - Pink
7. 🟠 **ส้ม** (Som) - Orange

## How to Play

1. **Allow Camera Access**: Grant permission to use your device camera
2. **Click "เริ่มเล่น" (Start Game)**: Begin the 60-second challenge
3. **Read the Thai Instruction**: At the top in the purple card
4. **Locate the Correct Color**: Find the matching colored circle
5. **Hold Your Index Finger**: Keep your fingertip over the circle for 0.5 seconds
6. **Advance**: Successfully select colors to increase your score and level
7. **View Results**: Check your final score, level, and accuracy after 60 seconds

## Technical Stack

- **HTML5 Canvas**: For hand skeleton rendering
- **MediaPipe Hands**: Real-time hand pose estimation
- **Web Audio API**: Sound effect generation
- **Web Speech API**: Thai text-to-speech synthesis
- **Responsive CSS**: Mobile and tablet support
- **Vanilla JavaScript**: Game logic and interactivity

## Browser Requirements

- Modern browser with WebRTC support (Chrome, Firefox, Edge, Safari)
- Webcam/camera device
- Camera permissions enabled
- JavaScript enabled

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lermintech-cloud/color-ar-game.git
   ```

2. Open `index.html` in your browser

3. Allow camera access when prompted

4. Start learning!

## Performance Tips

- Use a well-lit environment for better hand detection
- Keep your hand within the video frame
- Position camera at eye level for optimal tracking
- Use in fullscreen mode for better experience

## Educational Value

- **Vocabulary Building**: Learn 7 Thai color names through repetition
- **Language Reinforcement**: Audio pronunciation reinforces learning
- **Motor Skill Development**: Hand tracking promotes hand-eye coordination
- **Quick Thinking**: Time pressure encourages fast processing
- **Immediate Feedback**: Gamification motivates continued learning

## Accessibility

- Large, easy-to-tap color circles
- Clear Thai font for readability
- High contrast colors for visibility
- Adjustable audio levels through browser settings
- Fullscreen mode for distraction-free play

## License

MIT License - Feel free to use and modify for educational purposes.

## Author

Created for young Thai language learners (Grades 1-3)

---

**Play now and become a Color Hunter! 🎨🎮**