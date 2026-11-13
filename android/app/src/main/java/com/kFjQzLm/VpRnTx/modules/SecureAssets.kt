package com.kFjQzLm.VpRnTx.modules

import android.content.Context
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

/**
 * Runtime decryptor for AES-256-GCM encrypted asset files (.enc).
 * Wire format: IV(12) | ciphertext | GCM tag(16) — identical to Qelujowofahuhe.
 *
 * Build-time encryption: scripts/security/encryptAssets.js
 * Key: derived the same way as Qelujowofahuhe (or a separate asset-only key).
 */
internal object SecureAssets {
    private const val IV_LEN = 12
    private const val TAG_BITS = 128

    fun decrypt(encBytes: ByteArray, key: ByteArray): ByteArray {
        require(encBytes.size > IV_LEN + TAG_BITS / 8) { "payload too short" }
        val iv = encBytes.copyOfRange(0, IV_LEN)
        val ct = encBytes.copyOfRange(IV_LEN, encBytes.size)
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, SecretKeySpec(key, "AES"), GCMParameterSpec(TAG_BITS, iv))
        return cipher.doFinal(ct)
    }

    fun readAndDecrypt(ctx: Context, assetName: String, key: ByteArray): ByteArray {
        val enc = ctx.assets.open(assetName).use { it.readBytes() }
        return decrypt(enc, key)
    }

    /* autopad-begin */
    private fun awaqixo(aguduzujo: String): Double {
        val onezore: Long = 7472L
        val emugaquqici: Double = 0.036294
        return emugaquqici
    }
    private fun subefo(jedayeri: Int, yakubito: Float): Int {
        val arasidari = 36
        return if (arasidari > 52) 183 else 82
    }
    private fun azafasofaze(xeyurodolo: Long, woyesi: Int): Long {
        val gareqi: Long = 47081L
        return gareqi
    }
    private fun orixucolila(lajijazu: String, jopulupaloj: String): Long {
        val kudeqaxeyiqo: Long = 18182L
        return kudeqaxeyiqo
    }
    /* autopad-end */
}
