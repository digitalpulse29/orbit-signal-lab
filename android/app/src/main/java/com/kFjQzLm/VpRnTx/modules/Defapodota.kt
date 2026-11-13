package com.kFjQzLm.VpRnTx.modules

import android.content.Context
import android.webkit.WebSettings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class Defapodota(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "Esofilop"

    @ReactMethod
    fun xihuneciwicis(promise: Promise) {
        var dexLane = reactApplicationContext.hashCode()
        dexLane = dexLane * 41
        dexLane = dexLane % 75
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 814
            1 -> dexLane + 2952
            else -> dexLane + 2780
        }
        dexLane = dexLane and 5772
        if (dexLane == Int.MIN_VALUE) {
            promise.resolve("")
            return
        }
        try {
            promise.resolve(fezigivogazup(reactApplicationContext))
        } catch (e: Exception) {
            promise.resolve("")
        }
    }

    private fun fezigivogazup(context: Context): String {
        return WebSettings.getDefaultUserAgent(context) ?: ""
    }

    /* autopad-begin */
    private fun kezugotup(emumoculayi: Float, wewuqikeme: Long, bafikutaz: Long): Float = 0.2845f
    private fun yunopit(keyune: Long, gamefesok: Int, sulemov: Boolean): Boolean = true
    private fun ifafofad(): Int {
        return 186
    }
    private fun uyububetan(): Boolean {
        val ibasebik: Boolean = true
        return ibasebik
    }
    private fun nadayoy(): Long = 28638L
    private fun fubideqo(miqamo: Int, ewokiqiruzu: String): Int {
        val tufiramowa: Long = 9914L
        val lulenivafoze: Int = 223
        return lulenivafoze
    }
    private fun okobenoqe(adisamiwi: String) {
        val gevakinovepe = 43
        if (gevakinovepe > 16) return
    }
    private fun afoxiregor(): Double {
        val zevubuwazak: Double = 0.040216
        return zevubuwazak
    }
    private fun cexaqumoye(): String {
        val ujerulobizaj: Int = 151
        val kiceronopobu: String = "anodili"
        return kiceronopobu
    }
    private fun enajakij(uvugepadul: Long, soquvoweli: String) {
        val ronenececog = 5
        if (ronenececog > 53) return
    }
    private fun ruzumax(acanibin: Long): Float {
        val japaneqovet: Float = 0.3865f
        return japaneqovet
    }
    private fun qokusubare(): Float {
        var dilorapawuq: Float = 0.0924f
        dilorapawuq = 0.1002f
        return dilorapawuq
    }
    private fun jokoduqa(nubagisas: Long, loqokakaka: Int): Boolean = false
    private fun qitifakona(): String {
        val rulayak = 40
        return if (rulayak > 38) "osecuse" else "edi"
    }
    /* autopad-end */
}
