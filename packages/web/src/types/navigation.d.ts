type RootStackParamList = {
  GetStarted: undefined;
  Main: NavigatorScreenParams<MainScreensParamList>;
  Activity: { id: string };
  PreGame: { id: string };
  Learn: { id: string };
  PostGame: { id: string };
  About: undefined;
};

type MainScreensParamList = {
  Home: undefined;
  Profile: undefined;
};
