import { useRouter, useSegments } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CustomBottomTab() {
  const router = useRouter();
  const segments = useSegments();
  const currentSegment = segments[segments.length - 1]; // e.g. "DashboardScreen"

  const tabs = [
    { route: '/screens/dashboard/DashboardScreen', label: 'Dashboard', match: 'DashboardScreen' },
    { route: '/screens/money/MoneyScreen', label: 'Money', match: 'MoneyScreen' },
    { route: '/screens/setting/SettingScreen', label: 'Setting', match: 'SettingScreen' },
    { route: '/screens/yourprofile/YourprofileScreen', label: 'Profile', match: 'YourprofileScreen' },
    { route: '/screens/classlist/ClasslistScreen', label: 'ClassList', match: 'ClasslistScreen' },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        borderTopWidth: 1,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // for Android shadow
        zIndex: 10,
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentSegment === tab.match;

        return (
          <TouchableOpacity
            key={tab.route}
            onPress={() => router.push(tab.route as any)}
          >
            <Text
              style={{
                color: isActive ? 'blue' : 'gray',
                fontWeight: isActive ? 'bold' : 'normal',
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
