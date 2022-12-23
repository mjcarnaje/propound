type RootStackParamList = {
  GetStarted: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Main: NavigatorScreenParams<MainScreensParamList>;
  Activity: { id: string };
  PreGame: { id: string };
  Learn: { id: string };
  PostGame: { id: string };
  About: undefined;
  Result: undefined;
};

type MainScreensParamList = {
  Home: undefined;
  Profile: undefined;
};
