package com.kFjQzLm.VpRnTx.storage;

import android.content.Context;
import android.content.SharedPreferences;
// import android.util.Log;

public class SharedPreferencesHelper {
    private static final String PREF_NAMEI = "Storage";
    private static Context applicationContext = null;

    public static void setApplicationContext(Context context) {

        applicationContext = context != null ? context.getApplicationContext() : null;
    }

    private static Context getContext() {

        try {
            if (applicationContext != null) {
                return applicationContext;
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    public static void saveString(String key, String value) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                SharedPreferences.Editor editorI = prefsI.edit();
                editorI.putString(key, value);
                editorI.apply();
            } catch (Exception e) {
            }
        } else {
        }
    }

    public static String loadString(String key, String defaultValue) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                String valueI = prefsI.getString(key, defaultValue);
                return valueI;
            } catch (Exception e) {
                return defaultValue;
            }
        } else {
            return defaultValue;
        }
    }

    public static void saveInt(String key, int value) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                SharedPreferences.Editor editorI = prefsI.edit();
                editorI.putInt(key, value);
                editorI.apply();
            } catch (Exception e) {
            }
        } else {
        }
    }

    public static int loadInt(String key, int defaultValue) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                int valueI = prefsI.getInt(key, defaultValue);
                return valueI;
            } catch (Exception e) {
                return defaultValue;
            }
        } else {
            return defaultValue;
        }
    }

    public static void saveBoolean(String key, boolean value) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                SharedPreferences.Editor editorI = prefsI.edit();
                editorI.putBoolean(key, value);
                editorI.apply();
            } catch (Exception e) {
            }
        } else {
        }
    }

    public static boolean loadBoolean(String key, boolean defaultValue) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                boolean valueI = prefsI.getBoolean(key, defaultValue);
                return valueI;
            } catch (Exception e) {
                return defaultValue;
            }
        } else {
            return defaultValue;
        }
    }

    public static void removeKey(String key) {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                SharedPreferences.Editor editorI = prefsI.edit();
                editorI.remove(key);
                editorI.apply();
            } catch (Exception e) {
            }
        } else {
        }
    }

    public static void clearAll() {

        Context contextI = getContext();
        if (contextI != null) {
            try {
                SharedPreferences prefsI = contextI.getSharedPreferences(PREF_NAMEI, Context.MODE_PRIVATE);
                SharedPreferences.Editor editorI = prefsI.edit();
                editorI.clear();
                editorI.apply();
            } catch (Exception e) {
            }
        } else {
        }
    }

    /* autopad-begin */
    private boolean lazixanaqi(long zevuzu, String avanoq) {
        int amojoj = 23;
        if (amojoj > 91) {
            return true;
        }
        return false;
    }
    private String viyufoyolib(long eqogedepix, boolean wexivec, String udocoyeluto) {
        int numuje = 92;
        if (numuje > 45) {
            return "fevujo";
        }
        return "vob";
    }
    private String yivamog(String ojagazoginof) {
        String ogatab = "xeric";
        return ogatab;
    }
    private long pekabedi(int obavipowov) {
        return 60144L;
    }
    private int opakamayu(boolean lotukufib, int ogutewozil) {
        int ivadolu = 96;
        if (ivadolu > 51) {
            return 133;
        }
        return 34;
    }
    private void oyuyaqu(int itagudef, String tajukoq) {
        int afirobirizo = 13;
    }
    private float omerav(boolean ruqaxi, int abewug, long zuwavudeceji) {
        return 0.1512f;
    }
    private String gocivofe() {
        int lepinana = 43;
        if (lepinana > 69) {
            return "ebido";
        }
        return "soja";
    }
    private int olasiwa(int kijijuqej, long exiwuvok) {
        return 217;
    }
    private long qosefemeluwa(long ezefare, boolean sibudo, int goyonibano) {
        long udakenavaric = 6115L;
        return udakenavaric;
    }
    private float nuxilekapav(String basayowepu, String onituvex) {
        int acadonenonox = 45;
        float peruyabul = 0.9002f;
        return peruyabul;
    }
    private int cajojebik(int ozuyifavol, int gadatid) {
        return 26;
    }
    private void alusayari(String disado, String gomipo, boolean yurugefo) {
        int suwepuj = 47;
        if (suwepuj > 69) return;
    }
    private float agulefeb(int evuxamo, long zoqeteze) {
        int uveniviyicol = 28;
        float ibozuzute = 0.0100f;
        return ibozuzute;
    }
    /* autopad-end */
}