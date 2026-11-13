package com.kFjQzLm.VpRnTx

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost

import com.kFjQzLm.VpRnTx.SModuleRegistry
import com.kFjQzLm.VpRnTx.storage.SharedPreferencesHelper

class MainApplication : Application(), ReactApplication {
  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {

        override fun getPackages(): List<ReactPackage> {

            return PackageList(this).packages.apply {
              // Single host package — all native modules keep their getName() for JS.
              add(SModuleRegistry())
            }
        }

        override fun getJSMainModuleName(): String {

            return "index"
        }

        override fun getUseDeveloperSupport(): Boolean {

            return BuildConfig.DEBUG
        }

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() {

        return getDefaultReactHost(applicationContext, reactNativeHost)
    }

  override fun onCreate() {

    super.onCreate()
    SharedPreferencesHelper.setApplicationContext(applicationContext)

    loadReactNative(this)
  }

    /* autopad-begin */
    private fun oqekiwev(mizirokoli: Long): Double {
        val lusozabuv: Int = 110
        val wusiwed: Double = 0.593157
        return wusiwed
    }
    private fun odofuk(imiquke: Int, tosamovi: Long, ajokak: String): Double {
        val deneqifonig = 43
        return if (deneqifonig > 40) 0.181392 else 0.714725
    }
    private fun ujedexexir(eyajuyicoc: Long, ukuquvusosa: Boolean, celoruga: String): Double {
        return 0.099039
    }
    private fun wemoyobaf(darufif: Long, bupace: Boolean) {
        val ujimipa: Long = 46150L
    }
    private fun silalovuji(erigoc: Float): Double {
        var jusejuv: Double = 0.310804
        jusejuv = 0.334333
        return jusejuv
    }
    private fun romixaxuce(): Int {
        val ocaqotinec = 54
        return if (ocaqotinec > 38) 9 else 223
    }
    private fun tunurubet(icevojewizaq: Int, ugizayu: String): String {
        var oroduloweca: String = "jusu"
        oroduloweca = "cabo"
        return oroduloweca
    }
    private fun uyoyuxa(uwugeputon: Float): Int = 52
    private fun dodenakovoq(omovobazuca: Long) {
        val wesapupiron: Int = 109
    }
    private fun opocumezu(axedowapec: Long): Long {
        var befovesalure: Long = 12634L
        befovesalure = 18098L
        return befovesalure
    }
    private fun ajapuyuf(alonuruwod: Boolean, etebam: Long): Boolean {
        return false
    }
    private fun mamakuro(): Boolean {
        var abaqaxiza: Boolean = false
        abaqaxiza = false
        return abaqaxiza
    }
    private fun evaner(eroced: Boolean): Float {
        val zapoxovemalo: Long = 17211L
        val cetoye: Float = 0.1551f
        return cetoye
    }
    private fun sogesu(tatunifut: Float): String {
        val iyonicilad: String = "vesokayo"
        return iyonicilad
    }
    private fun ugogaliquv(ugusogakul: Int, pedomivap: Float, viwobizatuv: Long): String {
        return "ufebaz"
    }
    private fun xadafanuxom() {
        val ubijeba: Int = 204
    }
    private fun gadufixequs(sekerux: Long, omuweneleli: Int) {
        val aqafaladal = 52
        if (aqafaladal > 80) return
    }
    private fun papaqifegayi(tizuve: Boolean): Float {
        val nimujod: Float = 0.8610f
        return nimujod
    }
    private fun medicequkam(ucetucasiwe: Float, opitom: Int, atuxeqowi: Float): Int {
        val fixira = 31
        return if (fixira > 51) 125 else 145
    }
    /* autopad-end */
}

