// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, AppState } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useTranslation } from 'react-i18next';

// 번역 리소스 정의
const resources = {
  en: {
    translation: {
      title: 'Device Language Detector',
      currentLanguage: 'Current language setting:',
      languageInfo: 'Language information:',
      countryCode: 'Country code:',
      languageTag: 'Language tag:',
      deviceLocales: 'All device locales:',
    },
  },
  ko: {
    translation: {
      title: '기기 언어 감지기',
      currentLanguage: '현재 언어 설정:',
      languageInfo: '언어 정보:',
      countryCode: '국가 코드:',
      languageTag: '언어 태그:',
      deviceLocales: '모든 기기 로케일:',
    },
  },
  ja: {
    translation: {
      title: 'デバイス言語検出器',
      currentLanguage: '現在の言語設定:',
      languageInfo: '言語情報:',
      countryCode: '国コード:',
      languageTag: '言語タグ:',
      deviceLocales: 'すべてのデバイスロケール:',
    },
  },
};

// i18n 초기화
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: RNLocalize.getLocales()[0].languageCode,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

const App = () => {
  const { t } = useTranslation();
  const [deviceLanguage, setDeviceLanguage] = useState({});
  const [appState, setAppState] = useState(AppState.currentState);

  // 언어 정보 업데이트 함수
  const updateLanguageInfo = () => {
    const locales = RNLocalize.getLocales();
    if (locales && locales.length > 0) {
      setDeviceLanguage({
        languageCode: locales[0].languageCode,
        countryCode: locales[0].countryCode,
        languageTag: locales[0].languageTag,
        isRTL: locales[0].isRTL,
        allLocales: locales,
      });

      // i18n 언어 업데이트
      i18n.changeLanguage(locales[0].languageCode);
    }
  };

  useEffect(() => {
    // 초기 언어 정보 설정
    updateLanguageInfo();

    // AppState 변경 감지를 통해 언어 설정 변경 확인
    // 사용자가 설정 앱에서 언어를 변경한 후 앱으로 돌아올 때 감지
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // 앱이 다시 활성화되면 언어 정보 업데이트
        updateLanguageInfo();
      }
      setAppState(nextAppState);
    });

    // 클린업 함수
    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('title')}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>{t('currentLanguage')}</Text>
          <Text style={styles.infoText}>{deviceLanguage.languageCode || 'Unknown'}</Text>

          <Text style={styles.sectionTitle}>{t('languageInfo')}</Text>
          <Text style={styles.infoText}>
            {t('countryCode')} {deviceLanguage.countryCode || 'Unknown'}
          </Text>
          <Text style={styles.infoText}>
            {t('languageTag')} {deviceLanguage.languageTag || 'Unknown'}
          </Text>

          <Text style={styles.sectionTitle}>{t('deviceLocales')}</Text>
          {deviceLanguage.allLocales && deviceLanguage.allLocales.map((locale, index) => (
            <Text key={index} style={styles.localeText}>
              {locale.languageCode}-{locale.countryCode} ({locale.languageTag})
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#555',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  localeText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
});

export default App;