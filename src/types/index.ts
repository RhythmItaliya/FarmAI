export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  OTPVerification: {
    email: string;
    username: string;
  };
  Home: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  HomeSub: undefined;
};
