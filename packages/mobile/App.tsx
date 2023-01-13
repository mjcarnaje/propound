import { StudentDocType } from "@propound/types";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "expo-dev-client";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { onAuthStateChanged } from "firebase/auth";
import { doc, DocumentReference, getDoc } from "firebase/firestore";
import { Box, NativeBaseProvider, Text, useToken } from "native-base";
import React, { useCallback, useEffect } from "react";
import {
  LogBox,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-gesture-handler";
import "react-native-get-random-values";
import {
  Home as HomeIcon,
  Profile as ProfileIcon,
} from "./components/svgs/bottom-tab";
import "./configs/firebase";
import { auth, collections } from "./configs/firebase";
import { MainScreensParamList, RootStackParamList } from "./navigation";
import AboutScreen from "./screens/AboutScreen";
import ActivityScreen from "./screens/ActivityScreen";
import GetStartedScreen from "./screens/GetStartedScreen";
import HomeScreen from "./screens/HomeScreen";
import LearnScreen from "./screens/LearnScreen";
import PostGameScreen from "./screens/PostGameScreen";
import PreGameScreen from "./screens/PreGameScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ResultScreen from "./screens/ResultScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { useAuthStore } from "./store/auth";

SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs([
  "Setting a timer",
  "VirtualizedLists should never be nested",
  "AsyncStorage",
]);

export const fontFamily = {
  "Inter-Thin": require("./assets/fonts/Inter-Thin.ttf"),
  "Inter-ExtraLight": require("./assets/fonts/Inter-ExtraLight.ttf"),
  "Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
  "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
  "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
  "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
  "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
  "Inter-ExtraBold": require("./assets/fonts/Inter-ExtraBold.ttf"),
  "Inter-Black": require("./assets/fonts/Inter-Black.ttf"),
  "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
  "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
  "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
  "Proxima-Nova": require("./assets/fonts/Proxima-Nova.otf"),
};

export default function App() {
  const [fontsLoaded] = useFonts({ ...fontFamily });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <Box flexGrow={1} onLayout={onLayoutRootView}>
        <PropoundNavigation />
      </Box>
    </NativeBaseProvider>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

const PropoundNavigation: React.FC = () => {
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        const userRef = doc(
          collections.students,
          user.uid
        ) as DocumentReference<StudentDocType>;
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainScreens} />
            <Stack.Screen
              options={{ headerShown: true, headerShadowVisible: false }}
              name="Activity"
              component={ActivityScreen}
            />
            <Stack.Screen
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTitleAlign: "center",
              }}
              name="About"
              component={AboutScreen}
            />
            <Stack.Screen
              options={{
                title: "Pre Game",
                headerShown: true,
                headerShadowVisible: false,
              }}
              name="PreGame"
              component={PreGameScreen}
            />
            <Stack.Screen
              options={{
                title: "Materials",
                headerShown: true,
                headerTitleAlign: "center",
                headerShadowVisible: false,
              }}
              name="Learn"
              component={LearnScreen}
            />
            <Stack.Screen
              options={{
                title: "Post Game",
                headerShown: true,
                headerTitleAlign: "center",
                headerShadowVisible: false,
              }}
              name="PostGame"
              component={PostGameScreen}
            />
            <Stack.Screen
              options={{
                title: "My Learning Journey",
                headerShown: true,
                headerTitleAlign: "center",
                headerShadowVisible: false,
              }}
              name="Result"
              component={ResultScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="GetStarted" component={GetStartedScreen} />
            <Stack.Screen
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTitleAlign: "center",
                headerTitle: "Sign In",
              }}
              name="SignIn"
              component={SignInScreen}
            />
            <Stack.Screen
              options={{
                headerShown: true,
                headerShadowVisible: false,
                headerTitleAlign: "center",
                headerTitle: "Sign Up",
              }}
              name="SignUp"
              component={SignUpScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Main = createBottomTabNavigator<MainScreensParamList>();

const MainScreens: React.FC = () => {
  return (
    <Main.Navigator
      initialRouteName="Home"
      tabBar={(props) => <BottomTabs {...props} />}
    >
      <Main.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Main.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={ProfileScreen}
      />
    </Main.Navigator>
  );
};

const BOTTOM_TAB_HEIGHT = 70;
const ICON_SIZE = 22;

const bottomTabs = [
  {
    name: "Home",
    icon: HomeIcon,
    showInBottomTab: true,
  },
  {
    name: "Profile",
    icon: ProfileIcon,
    showInBottomTab: true,
  },
];

interface BottomTabsProps extends BottomTabBarProps {}

const BottomTabs: React.FC<BottomTabsProps> = ({
  state,
  descriptors,
  navigation,
  insets,
}) => {
  const [orange] = useToken("colors", ["orange.500"]);

  return (
    <View
      style={[
        styles.bottomTabsView,
        { backgroundColor: "white", height: BOTTOM_TAB_HEIGHT + insets.bottom },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const { name: label, icon: Icon, showInBottomTab } = bottomTabs[index];

        if (!showInBottomTab) return;

        const color = isFocused ? orange : "#555562";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, params: {} });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tab,
              {
                borderTopColor: isFocused ? orange : "transparent",
                height: BOTTOM_TAB_HEIGHT,
              },
            ]}
          >
            <Icon width={ICON_SIZE} height={ICON_SIZE} color={color} />
            <Text color={color} fontSize={12} fontWeight="semibold" mt={"5px"}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTabsView: {
    flexDirection: "row",
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowOpacity: 0.85,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth,
        },
      },
      default: {
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }),
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 4,
    borderTopRightRadius: 2,
    borderTopLeftRadius: 2,
  },
});
