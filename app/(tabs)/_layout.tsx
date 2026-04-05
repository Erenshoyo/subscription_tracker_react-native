import { tabs } from "@/assets/constants/data";
import { colors, components } from "@/assets/constants/theme";
// eslint-disable-next-line import/no-named-as-default
import clsx from "clsx";
import { Tabs, Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { icons } from "@/assets/constants/icons";

interface TabIconProps {
  focused: boolean;
  icon: typeof icons[keyof typeof icons];
}

const tabBar = components.tabBar;
const ICON_VERTICAL_ADJUSTMENT_FACTOR = 1.6;

const TabIcon = ({ focused, icon }: TabIconProps) => {
  return (
    <View className="tabs-icon">
      <View className={clsx("tabs-pill", focused && "tabs-active")}>
        <Image source={icon} resizeMode="contain" className="tabs-glyph" />
      </View>
    </View>
  );
};

const TabLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
            paddingVertical: tabBar.height/2 - tabBar.iconFrame/ICON_VERTICAL_ADJUSTMENT_FACTOR
        },
        tabBarIconStyle: {
            width: tabBar.iconFrame,
            height: tabBar.iconFrame,
            alignItems: "center",
            
        }
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;
