export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerification: {
    email: string;
    username: string;
  };
  Onboarding: undefined;
  Home: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  HomeSub: undefined;
};
