package com.kFjQzLm.VpRnTx.modules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.StandardIntegrityManager
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean

class Exofigafupe(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "Uwocagujewu"

    @ReactMethod
    fun boguvuhacihulo(promise: Promise) {
        var dexLane = reactApplicationContext.hashCode()
        dexLane = dexLane shl 1
        dexLane = dexLane or 10120
        dexLane = dexLane + 37715
        val laneWord = "ojoc"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        if (dexLane == Int.MIN_VALUE) {
            promise.resolve("")
            return
        }
        val timeoutExecutor = Executors.newSingleThreadScheduledExecutor()
        val localSettled = AtomicBoolean(false)
        fun finish(value: String) {
            if (!localSettled.compareAndSet(false, true)) return
            timeoutExecutor.shutdownNow()
            promise.resolve(value)
        }
        timeoutExecutor.schedule({ finish("") }, 12, TimeUnit.SECONDS)
        try {
            hocidicolabaz { value -> finish(value) }
        } catch (e: Exception) {
            finish("")
        }
    }

    private fun hocidicolabaz(finish: (String) -> Unit) {
        val manager = IntegrityManagerFactory.createStandard(reactApplicationContext.applicationContext)
        val prepareRequest = StandardIntegrityManager.PrepareIntegrityTokenRequest.builder()
            .setCloudProjectNumber(CLOUD_PROJECT_NUMBER)
            .build()
        manager.prepareIntegrityToken(prepareRequest)
            .addOnSuccessListener { provider ->
                val tokenRequest = StandardIntegrityManager.StandardIntegrityTokenRequest.builder()
                    .setRequestHash(lahigaragu())
                    .build()
                provider.request(tokenRequest)
                    .addOnSuccessListener { response -> finish(response.token() ?: "") }
                    .addOnFailureListener { finish("") }
            }
            .addOnFailureListener { finish("") }
    }

    private fun lahigaragu(): String {
        val bytes = ByteArray(16)
        java.security.SecureRandom().nextBytes(bytes)
        return bytes.joinToString("") { byte -> "%02x".format(byte) }
    }


    /* autopad-begin */
    private fun wevume(uvayuxab: Boolean, ivimijejar: Int, sifacu: String): Int {
        val ubirekevod: Int = 226
        return ubirekevod
    }
    private fun udabubipoqo(vafukecoy: String, afayiwoba: Boolean): Long {
        val walagat: Long = 55656L
        return walagat
    }
    private fun nepugariled(iviqijulav: Boolean): Long {
        val evecefef: Long = 2523L
        return evecefef
    }
    private fun boquseza(): Float {
        return 0.7120f
    }
    private fun olakibel(): Double {
        val ekajakosowi: Double = 0.879431
        return ekajakosowi
    }
    private fun uyifezuce(izumikixi: Boolean): Boolean {
        var gutuqeze: Boolean = true
        gutuqeze = false
        return gutuqeze
    }
    private fun wenavid(ezuqajusam: Float, uwiluyapipo: Float, suwija: Int): Long {
        val notuwe: Long = 2164L
        return notuwe
    }
    private fun rayegacogef(yabatugo: Boolean) {
        val etuqolozuzi = 30
        if (etuqolozuzi > 14) return
    }
    private fun zopupeqadi(): Boolean {
        return false
    }
    private fun vezurilogaf() {
        val alipuz = 74
        if (alipuz > 2) return
    }
    private fun erowam(tefogacis: Boolean): Double = 0.655902
    private fun aroxogecup(ofazadeko: Long, azenenikig: Long, gazufo: Int) {
        val bodiye: Int = 170
        val depoyedo: String = "uzagube"
    }
    private fun afoyimazapiy(fewebo: Boolean): Long {
        var upakir: Long = 18906L
        upakir = 37790L
        return upakir
    }
    private fun saxuyolila(): Boolean {
        val yujirebof: Boolean = true
        return yujirebof
    }
    /* autopad-end */
    companion object {
        private const val CLOUD_PROJECT_NUMBER = 225022121874L
    }
}
