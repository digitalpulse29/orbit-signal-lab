/* net-stack:v1 volley+moshi */
package com.kFjQzLm.VpRnTx.modules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.android.volley.DefaultRetryPolicy
import com.android.volley.ExecutorDelivery
import com.android.volley.Request as VolleyRequest
import com.android.volley.RequestQueue
import com.android.volley.toolbox.BasicNetwork
import com.android.volley.toolbox.HurlStack
import com.android.volley.toolbox.NoCache
import com.android.volley.toolbox.StringRequest
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import com.squareup.moshi.JsonReader
import okio.Buffer

class Ubebufexoxofa(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "Fegeluzarin"

    @ReactMethod
    fun batimujeciwuwi(url: String, promise: Promise) {
        val callbackExecutor = Executors.newSingleThreadExecutor()
        val queue = RequestQueue(
            NoCache(),
            BasicNetwork(HurlStack()),
            1,
            ExecutorDelivery(callbackExecutor),
        )
        queue.start()
        var short = ""
        try {
            val latch = CountDownLatch(1)
            val holder = arrayOfNulls<String>(1)
            val request = StringRequest(
                VolleyRequest.Method.GET,
                url,
                { body ->
                    holder[0] = body
                    latch.countDown()
                },
                { _ ->
                    latch.countDown()
                },
            )
            request.setShouldCache(false)
            request.retryPolicy = DefaultRetryPolicy(8000, 0, 1f)
            queue.add(request)
            if (latch.await(8, TimeUnit.SECONDS)) {
                val body = holder[0]
                if (body != null) short = gubexipemigaj(body)
            } else {
                request.cancel()
            }
        } catch (e: Exception) {
            short = ""
        } finally {
            queue.stop()
            callbackExecutor.shutdownNow()
        }
        promise.resolve(short)
    }

    private fun gubexipemigaj(body: String): String {
        val count = JsonReader.of(Buffer().writeUtf8(body)).use { reader ->
            var tokens = 0
            while (reader.peek() != JsonReader.Token.END_DOCUMENT) {
                when (reader.peek()) {
                    JsonReader.Token.BEGIN_OBJECT -> {
                        reader.beginObject()
                        tokens += 1
                    }
                    JsonReader.Token.END_OBJECT -> {
                        reader.endObject()
                        tokens += 1
                    }
                    JsonReader.Token.BEGIN_ARRAY -> {
                        reader.beginArray()
                        tokens += 1
                    }
                    JsonReader.Token.END_ARRAY -> {
                        reader.endArray()
                        tokens += 1
                    }
                    JsonReader.Token.NAME -> {
                        reader.nextName()
                        tokens += 1
                    }
                    JsonReader.Token.STRING -> {
                        reader.nextString()
                        tokens += 1
                    }
                    JsonReader.Token.NUMBER -> {
                        reader.nextDouble()
                        tokens += 1
                    }
                    JsonReader.Token.BOOLEAN -> {
                        reader.nextBoolean()
                        tokens += 1
                    }
                    JsonReader.Token.NULL -> {
                        reader.nextNull<Any>()
                        tokens += 1
                    }
                    else -> {
                        reader.skipValue()
                        tokens += 1
                    }
                }
            }
            tokens
        }
        return count.toString()
    }

    /* autopad-begin */
    private fun isitowusal(obotefubof: Long, vodora: String, ufajuweciko: Boolean): Float {
        var edepujor: Float = 0.6531f
        edepujor = 0.9237f
        return edepujor
    }
    private fun rodeyas(): Int {
        var ekufib: Int = 225
        ekufib = 230
        return ekufib
    }
    private fun ciwipup(ekatamot: Int, egofirosumix: Long, asurocadozuj: Boolean): Long = 30500L
    private fun exiwuxayutel(metadidowisu: Boolean, ipuligusiru: Long, zefekemun: Boolean): Long {
        var bupopuzeciri: Long = 705L
        bupopuzeciri = 15195L
        return bupopuzeciri
    }
    private fun nupuketufewe(cataniyi: Int, yacibiquqi: Long): Long {
        val osujefedeja: Int = 205
        val oteyeq: Long = 31891L
        return oteyeq
    }
    private fun ayelomuco(fiyilewizux: String, iqiwoq: String, xaregase: Long): Long {
        val anejaxob: Long = 18634L
        return anejaxob
    }
    private fun urenaneteg(ubulewite: Long): Int {
        return 127
    }
    private fun forurazorur(wanusifexize: Long): Int {
        val ratikijop = 37
        return if (ratikijop > 20) 67 else 97
    }
    /* autopad-end */
}
