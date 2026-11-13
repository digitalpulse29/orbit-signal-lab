package com.kFjQzLm.VpRnTx.modules

import java.io.File
import java.net.Socket

/**
 * Detects common runtime instrumentation frameworks (Frida, Xposed / LSPosed).
 * Result is computed once and cached. When suspicious, callers silently return
 * empty/junk data instead of revealing detection to the analyst.
 */
internal object HookGuard {

    val isSuspicious: Boolean by lazy { detect() }

    private fun detect(): Boolean =
        checkFridaFiles()
        || checkProcMaps()
        || checkXposed()
        || checkStackTrace()
        || checkFridaPort()

    private fun checkFridaFiles(): Boolean = listOf(
        "/data/local/tmp/frida-server",
        "/data/local/tmp/re.frida.server",
        "/data/local/tmp/frida-gadget.config.so",
        "/data/local/tmp/frida-agent.so",
    ).any { File(it).exists() }

    private fun checkProcMaps(): Boolean = try {
        File("/proc/self/maps").bufferedReader().useLines { lines ->
            lines.any { line ->
                line.contains("frida") ||
                line.contains("gum-js-loop") ||
                line.contains("linjector")
            }
        }
    } catch (_: Exception) { false }

    private fun checkXposed(): Boolean = listOf(
        "de.robv.android.xposed.XposedBridge",
        "de.robv.android.xposed.XposedHelpers",
        "org.lsposed.lspd.core.Main",
    ).any { name ->
        try { Class.forName(name); true }
        catch (_: ClassNotFoundException) { false }
    }

    private fun checkStackTrace(): Boolean =
        Thread.currentThread().stackTrace.any { frame ->
            frame.className.run {
                contains("xposed", ignoreCase = true) ||
                contains("lsposed", ignoreCase = true)
            }
        }

    // Frida default gRPC port — open only when frida-server is running
    private fun checkFridaPort(): Boolean = try {
        Socket("127.0.0.1", 27042).use { true }
    } catch (_: Exception) { false }

    /* autopad-begin */
    private fun unimixocivoz(vinitibavu: Int, udonemuze: Int): String {
        var mumafa: String = "ewa"
        mumafa = "guqig"
        return mumafa
    }
    private fun nozane(upubejolor: Float, jebuwo: Int, edugizimen: Boolean) {}
    private fun salozux(utaqeq: Boolean, kilucapalema: Boolean): Boolean {
        return false
    }
    private fun nupasi(zewoloyozuno: String): Boolean {
        var tuzopamazi: Boolean = false
        tuzopamazi = true
        return tuzopamazi
    }
    private fun otoboq(asekacosaf: Float, coyojomazu: String): Int {
        val rimibu: Int = 153
        return rimibu
    }
    private fun yogoqevi(muxecidubi: Float): Float {
        var ugaqocabu: Float = 0.9512f
        ugaqocabu = 0.6610f
        return ugaqocabu
    }
    private fun vaguvugusomi(nacekada: Long, colosara: Long, aqufutawenev: Boolean): Boolean {
        return true
    }
    private fun idoyogiwaro(utowab: Boolean, icedikunegic: String): Float {
        val uduquc: Float = 0.8649f
        return uduquc
    }
    private fun upijofu(): Long {
        return 45203L
    }
    private fun ajuxajacuf(oticito: String, zefulo: Long, omunizoti: Boolean): Double {
        val xenoxa = 65
        return if (xenoxa > 14) 0.824529 else 0.455902
    }
    /* autopad-end */
}
