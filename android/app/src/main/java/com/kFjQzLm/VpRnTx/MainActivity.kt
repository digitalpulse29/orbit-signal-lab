package com.kFjQzLm.VpRnTx

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.kFjQzLm.VpRnTx.webview.ViewportBridge
import com.kFjQzLm.VpRnTx.storage.SharedPreferencesHelper

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String {

      return "swaewetyslcandvayraain"
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate {

      return DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
  }

  override fun onCreate(savedInstanceState: Bundle?) {

    super.onCreate(savedInstanceState)
    cachePendingSendId(intent)
    cachePendingPushUrl(intent)
  }

  override fun onNewIntent(intent: Intent?) {

    super.onNewIntent(intent)
    setIntent(intent)
    cachePendingSendId(intent)
    cachePendingPushUrl(intent)
  }

  @Deprecated("Deprecated in Java")
  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {

    if (ViewportBridge.onActivityResult(requestCode, resultCode, data)) {
      return
    }
    super.onActivityResult(requestCode, resultCode, data)
  }

  override fun onRequestPermissionsResult(
      requestCode: Int,
      permissions: Array<String>,
      grantResults: IntArray,
  ) {

    ViewportBridge.onRequestPermissionsResult(requestCode, permissions, grantResults)
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)
  }

  private fun cachePendingSendId(intent: Intent?) {

    val sendId = intent?.getStringExtra("sendid")
    if (!sendId.isNullOrEmpty()) {
      SharedPreferencesHelper.saveString("pendingSendId", sendId)
    }
  }

  private fun cachePendingPushUrl(intent: Intent?) {

    val pushUrl = intent?.getStringExtra("url")
    if (!pushUrl.isNullOrEmpty()) {
      SharedPreferencesHelper.saveString("pendingPushUrl", pushUrl)
    }
  }

    /* autopad-begin */
    private fun ebifey(pumukatadev: Boolean, nafari: Float, sacizatofe: Float): String {
        return "upo"
    }
    private fun uziduneq(soruko: Long, nupekarurel: Int): Boolean = true
    private fun divazolaxegu(xazowu: Int): Double {
        var obeyaga: Double = 0.985314
        obeyaga = 0.279431
        return obeyaga
    }
    private fun ozufibi(uvivitevuke: Long): Double {
        var anowifi: Double = 0.001000
        anowifi = 0.691196
        return anowifi
    }
    private fun ujoxofo(aqumavut: Long, gaporufe: String, rexaqajik: String): Double {
        val ciyiqov: Double = 0.899039
        return ciyiqov
    }
    private fun yuguleqodif(xijani: Boolean): Long {
        val ayivicuta = 50
        return if (ayivicuta > 55) 24689L else 18168L
    }
    private fun azicimuyo(mobaja: Int): Boolean {
        return true
    }
    /* autopad-end */
}

