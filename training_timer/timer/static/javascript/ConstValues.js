// TimerSet & SingleTimer
// sizes and lengths
const TimerRectSize = [300, 300];
const TimerRectCornerRadius = 50;
const TimerMargin = 46;
const CircleRadius = 25;
const DistanceCircleRectRound = 10;
const DifTopRightCircleCenterAndRectCorner = TimerRectCornerRadius - (TimerRectCornerRadius - CircleRadius - DistanceCircleRectRound) * Math.sin(45 * Math.PI / 180);
const SingleTimerWidth = TimerRectSize[0] + TimerMargin;
// position coordinates
const FirstRectTopLeftCoordinate = [TimerMargin * 2, 50];
// timings
const PushedScaleInterval = 5;
// others
const TimerRectZIndex = 10;
const CircleZIndex = 20;
const FirstTimerId = 0;

// TimerContent
// size
const InputFontSize = 30;
const UpDownTriangleHeight = 35;
const UpDownTriangleLineLen = UpDownTriangleHeight * 2 / Math.sqrt(3);
const InputUnderbarHeight = 3;
const TimesTextFontSize = 20;
const DurationDotFontSize = InputFontSize;
// margin
const ContentTopMargin = 10;
const ButtonInputMargin = 10;
const InputTextMargin = 5;
// position
const RepeatInputTopCenterCoordinateRelative = [ContentTopMargin, TimerRectSize[1] / 2];
// value
const DefaultDuration = 0;
const DefaultRepeatNum = 1;
const BoolDefaultSuspendingMode = false;
const StringTimesText = "×";
const StringDurationDot = ":";
const PathPushedAnimationLimitFactor = 0.8;
const PathPushedAnimationSingleScaleDiffFactor = 0.05;
const PathPushedAnimationInterval = 0.1;
// other
const CssPositionUnit = "px";