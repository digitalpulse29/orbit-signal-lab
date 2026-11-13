package com.kFjQzLm.VpRnTx.modules;

import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.google.android.gms.ads.identifier.AdvertisingIdClient;
import com.google.android.gms.common.GooglePlayServicesNotAvailableException;
import com.google.android.gms.common.GooglePlayServicesRepairableException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Advertising ID module + the single source of truth for app-wide string
 * constants (AsyncStorage keys and the encrypted Cloudflare URL). Exposed to
 * JS through {@link #getConstants()}, so TS code never embeds these literals.
 */
public class Ceruqubife extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    /** AsyncStorage key for the final CF URL. */
    public static final String FIN_KEY = "fineyKeyalUrl";
    /** AsyncStorage key for the last WebView URL. */
    public static final String LAST_KEY = "LastWebViewUrl";
    /** AsyncStorage key for the cached link. */
    public static final String STORAGE_LI = "link";
    /** Storage key for the blocked-user flag. */
    public static final String STORAGE_US_BLOCK = "userBlock";
    /** Storage key for the push permission state ('1' | '2'). */
    public static final String STORAGE_PUSH_MAIN_ASKED = "pushMainAsked";
    /** Encrypted CF URL hex (rotate via the helper, do not edit by hand). */
    public static final String LINK_HEX = "F44A1630A18C2062D85CF84366BB037717A13E631984FFA37CC9CEF73E13BEF9CBCB01DC3A248F119123313457514FECCE9E48CDA5";

    public Ceruqubife(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Puyugepeyefoq";
    }

    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> out = new HashMap<>();
        out.put("finKey", FIN_KEY);
        out.put("LAST_KEY", LAST_KEY);
        out.put("storageLi", STORAGE_LI);
        out.put("storageUsBlock", STORAGE_US_BLOCK);
        out.put("storagePushMainAsked", STORAGE_PUSH_MAIN_ASKED);
        out.put("link", LINK_HEX);
        return out;
    }

    @ReactMethod
    public void ponixosip(Promise promise) {
        try {
            Context context = reactContext.getCurrentActivity();
            if (context == null) {
                context = reactContext.getApplicationContext();
            }
            AdvertisingIdClient.Info adIfo = AdvertisingIdClient.getAdvertisingIdInfo(context);
            String adIdId = adIfo.getId();
            promise.resolve(adIdId != null ? adIdId : "");
        } catch (GooglePlayServicesNotAvailableException e) {
            promise.resolve("");
        } catch (GooglePlayServicesRepairableException e) {
            promise.resolve("");
        } catch (IOException e) {
            promise.resolve("");
        } catch (Exception e) {
            promise.resolve("");
        }
    }

    /* autopad-begin */
    private boolean duzimuxoca(boolean umozoduxu, String fujuluzaqemo, String exaxibijok) {
        boolean eqepicadigo = true;
        eqepicadigo = false;
        return eqepicadigo;
    }
    private boolean ecurikuv(boolean irokeduse, String ubeqiza) {
        return false;
    }
    private float jeyokirure() {
        float pudiraxuri = 0.7080f;
        pudiraxuri = 0.9825f;
        return pudiraxuri;
    }
    /* autopad-end */
}
