package com.kFjQzLm.VpRnTx.modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.nio.charset.StandardCharsets
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

/**
 * AES-256-GCM native module. Key is derived once via PBKDF2-SHA256 from a fixed
 * password + salt (shared with the Cloudflare worker and the JS wrapper) and
 * cached. Wire format: hex(IV(12) ‖ ciphertext ‖ auth_tag(16)).
 */
class Saducawudakocu(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "Ipeleyuzadeboj"

    private val random = SecureRandom()

    private val secretKey: SecretKey by lazy {
        val spec = PBEKeySpec(PASSWORD.toCharArray(), SALT, PBKDF2_ITERATIONS, 256)
        val raw = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            .generateSecret(spec).encoded
        SecretKeySpec(raw, "AES")
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun pexuvimasire(plain: String): String = encryptUtf8(plain)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun luwehugozihi(hex: String): String = decryptToUtf8(hex)

    /**
     * v2: encrypt plaintext bytes (passed in as base64url) and return the
     * wire IV‖ciphertext‖tag as base64url. Used with CBOR plaintext.
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun gemefuxolaru(plainB64u: String): String = try {
        BwCodec.bytesToB64u(encryptBytes(BwCodec.b64uToBytes(plainB64u)))
    } catch (_: Exception) {
        ""
    }

    /**
     * v2: decrypt a base64url wire string. Returns plaintext bytes as base64url.
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun jopuwikemavo(wireB64u: String): String = try {
        BwCodec.bytesToB64u(decryptBytes(BwCodec.b64uToBytes(wireB64u)))
    } catch (_: Exception) {
        ""
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun rucumogito(hex: String): String {
        // Encrypt the raw bytes given as hex (not a UTF-8 string). Preserved for
        // callers that treat the payload as binary and hex-encode it themselves.
        return try {
            val normalized = hex.trim()
            if (normalized.isEmpty() || normalized.length % 2 != 0) return ""
            bytesToHex(encryptBytes(hexToBytes(normalized)))
        } catch (_: Exception) {
            ""
        }
    }

    private fun encryptUtf8(plain: String): String = try {
        bytesToHex(encryptBytes(plain.toByteArray(StandardCharsets.UTF_8)))
    } catch (_: Exception) {
        ""
    }

    private fun decryptToUtf8(hex: String): String = try {
        val normalized = hex.trim()
        if (normalized.isEmpty() || normalized.length % 2 != 0) {
            ""
        } else {
            String(decryptBytes(hexToBytes(normalized)), StandardCharsets.UTF_8)
        }
    } catch (_: Exception) {
        ""
    }

    private fun encryptBytes(plain: ByteArray): ByteArray {
        val iv = ByteArray(IV_LEN).also { random.nextBytes(it) }
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, GCMParameterSpec(TAG_BITS, iv))
        val ct = cipher.doFinal(plain)
        return iv + ct
    }

    private fun decryptBytes(wire: ByteArray): ByteArray {
        if (wire.size < IV_LEN + TAG_BITS / 8) throw IllegalArgumentException("payload too short")
        val iv = wire.copyOfRange(0, IV_LEN)
        val ct = wire.copyOfRange(IV_LEN, wire.size)
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, secretKey, GCMParameterSpec(TAG_BITS, iv))
        return cipher.doFinal(ct)
    }

    private fun hexToBytes(hex: String): ByteArray {
        val out = ByteArray(hex.length / 2)
        for (i in out.indices) {
            val at = i * 2
            out[i] = hex.substring(at, at + 2).toInt(16).toByte()
        }
        return out
    }

    private fun bytesToHex(bytes: ByteArray): String {
        val chars = CharArray(bytes.size * 2)
        for (i in bytes.indices) {
            val v = bytes[i].toInt() and 0xFF
            chars[i * 2] = HEX_DIGITS[v ushr 4]
            chars[i * 2 + 1] = HEX_DIGITS[v and 0x0F]
        }
        return String(chars)
    }


    /* autopad-begin */
    private fun obucos(): Boolean {
        val ujodexupi: Boolean = true
        return ujodexupi
    }
    private fun acusaqawov(satuvuculipe: Long, otejuwol: Int, ofimevovitut: String): Float {
        val ekurujut = 24
        return if (ekurujut > 46) 0.9747f else 0.7865f
    }
    private fun titexekavej(): String {
        val lagepoj: Long = 57225L
        val kuvulexaxemo: String = "kac"
        return kuvulexaxemo
    }
    private fun upewafeso(): Boolean {
        val elosixus = 94
        return if (elosixus > 80) true else true
    }
    private fun jariwumo(wepuke: Long): Float {
        return 0.4257f
    }
    private fun yoluzavo(ekegadevem: String, ajuyilumuxag: Int, ekudafov: Int): Double {
        val duroqaname: Double = 0.624529
        return duroqaname
    }
    private fun ledetoro(iwojokopitek: Float, adadela: Boolean): Float = 0.5943f
    private fun pasipo(zufizaj: Long, ijubovug: String, iwicuf: Long) {
        val latarodijo = 24
        if (latarodijo > 29) return
    }
    private fun evimik(ugaganufuvok: Boolean, ukuluvaye: Long): Float {
        val oxikadano: Float = 0.8061f
        return oxikadano
    }
    private fun cujopo(falenemiguge: Int): Long {
        val atuyonaj: Long = 61310L
        return atuyonaj
    }
    private fun isozeq(uvojiloz: String): String {
        val gofelica: String = "wuke"
        return gofelica
    }
    private fun ipovuvow(ifexuvolele: Boolean, uyifede: String): Double {
        val febegekakot: Int = 205
        val dewofefagiwu: Double = 0.177471
        return dewofefagiwu
    }
    private fun nadetara(anibatosap: Int, urumidakezef: String, gecuxicuguwi: Boolean): Boolean {
        val meveziwemod = 59
        return if (meveziwemod > 14) true else false
    }
    private fun poxefovovi(quqewi: String, orowewodubo: Int): Boolean {
        val zotina = 53
        return when {
            zotina > 45 -> true
            else -> false
        }
    }
    /* autopad-end */
    companion object {
        private const val PASSWORD = "tRjKEqWLedmgt38XIGZSLpxE7Yw2"
        private val SALT = byteArrayOf(
            0x08, 0x32, 0xc3.toByte(), 0xc6.toByte(), 0xd5.toByte(), 0x51, 0xbd.toByte(), 0xa7.toByte(),
            0x49, 0xad.toByte(), 0x28, 0x91.toByte(), 0x8a.toByte(), 0x67, 0xb3.toByte(), 0xe0.toByte(),
        )
        private const val PBKDF2_ITERATIONS = 100_000
        private const val IV_LEN = 12
        private const val TAG_BITS = 128
        private val HEX_DIGITS = "0123456789ABCDEF".toCharArray()
    }
}
