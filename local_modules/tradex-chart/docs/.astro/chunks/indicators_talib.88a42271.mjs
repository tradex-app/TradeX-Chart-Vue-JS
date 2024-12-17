import { i as createVNode, F as Fragment, s as spreadAttributes } from './astro.7b6fbd1f.mjs';
import '@astrojs/internal-helpers/path';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'slash';
import 'node:fs/promises';
import './pages/404.astro.1d69ba63.mjs';
import 'html-escaper';
import 'fs';
import 'path';
/* empty css                        */import 'zod';
/* empty css                                                             */import 'execa';

const images = {
					
				};

				function updateImageReferences(html) {
					return html.replaceAll(
						/__ASTRO_IMAGE_="(.+)"/gm,
						(full, imagePath) => spreadAttributes({src: images[imagePath].src, ...images[imagePath].attributes})
					);
				}

				const html = updateImageReferences("<p><a href=\"https://github.com/TA-Lib/ta-lib\">TA-Lib</a> is widely used by trading software developers requiring to perform technical analysis of financial market data.</p>\n<p>A list of TA-Lib functions that have been implemented in TradeX-chart as indicators is found in <a href=\"indicators_default.md\">indicators_default.md</a></p>\n<p>The functions are accessible directly through the chart api.</p>\n<pre is:raw=\"\" class=\"astro-code min-dark\" style=\"background-color: #1f1f1f; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;\" tabindex=\"0\"><code><span class=\"line\"><span style=\"color: #79B8FF\">chart</span><span style=\"color: #B392F0\">.</span><span style=\"color: #79B8FF\">TALib</span><span style=\"color: #B392F0\">.SUM()</span></span></code></pre>\n<p>The description of each function, it’s parameters, return values and defaults are currently found in <a href=\"../src/definitions/talib-api.js\">talib-api.js</a> or <a href=\"../src/definitions/talib-api.json\">talib-api.json</a> files and may be directly imported from TradeX-chart to assist with building your own indicators.</p>\n<h2 id=\"function-list\">Function List</h2>\n<pre is:raw=\"\" class=\"astro-code min-dark\" style=\"background-color: #1f1f1f; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;\" tabindex=\"0\"><code><span class=\"line\"><span style=\"color: #b392f0\"></span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    Cycle Indicators</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    -----------------------------------------</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    HT_DCPERIOD - Hilbert Transform - Dominant Cycle Period</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    HT_DCPHASE - Hilbert Transform - Dominant Cycle Phase</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    HT_PHASOR - Hilbert Transform - Phasor Components</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    HT_SINE - Hilbert Transform - SineWave</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    HT_TRENDMODE - Hilbert Transform - Trend vs Cycle Mode</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    </span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    Math Operators</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    -----------------------------------------</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ADD - Vector Arithmetic Add</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    DIV - Vector Arithmetic Div</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MAX - Highest value over a specified period</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MAXINDEX - Index of highest value over a specified period</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MIN - Lowest value over a specified period</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MININDEX - Index of lowest value over a specified period</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MINMAX - Lowest and highest values over a specified period</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MINMAXINDEX - Indexes of lowest and highest values over a specified period</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MULT - Vector Arithmetic Mult</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    SUB - Vector Arithmetic Substraction</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    SUM - Summation</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    </span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    Math Transform</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    -----------------------------------------</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ACOS - Vector Trigonometric ACos</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ASIN - Vector Trigonometric ASin</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ATAN - Vector Trigonometric ATan</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CEIL - Vector Ceil</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    COS - Vector Trigonometric Cos</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    COSH - Vector Trigonometric Cosh</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    EXP - Vector Arithmetic Exp</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    FLOOR - Vector Floor</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    LN - Vector Log Natural</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    LOG10 - Vector Log10</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    SIN - Vector Trigonometric Sin</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    SINH - Vector Trigonometric Sinh</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    SQRT - Vector Square Root</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    TAN - Vector Trigonometric Tan</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    TANH - Vector Trigonometric Tanh</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    </span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    Momentum Indicators</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    -----------------------------------------</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ADX - Average Directional Movement Index</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ADXR - Average Directional Movement Index Rating</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    APO - Absolute Price Oscillator</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    AROON - Aroon</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    AROONOSC - Aroon Oscillator</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    BOP - Balance Of Power</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CCI - Commodity Channel Index</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CMO - Chande Momentum Oscillator</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    DX - Directional Movement Index</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MACD - Moving Average Convergence/Divergence</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MACDEXT - MACD with controllable MA type</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MACDFIX - Moving Average Convergence/Divergence Fix 12/26</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MFI - Money Flow Index</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MINUS_DI - Minus Directional Indicator</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MINUS_DM - Minus Directional Movement</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MOM - Momentum</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    PLUS_DI - Plus Directional Indicator</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    PLUS_DM - Plus Directional Movement</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    PPO - Percentage Price Oscillator</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ROC - Rate of change : ((price/prevPrice)-1)*100</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ROCP - Rate of change Percentage: (price-prevPrice)/prevPrice</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ROCR - Rate of change ratio: (price/prevPrice)</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ROCR100 - Rate of change ratio 100 scale: (price/prevPrice)*100</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    RSI - Relative Strength Index</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    STOCH - Stochastic</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    STOCHF - Stochastic Fast</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    STOCHRSI - Stochastic Relative Strength Index</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    TRIX - 1-day Rate-Of-Change (ROC) of a Triple Smooth EMA</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ULTOSC - Ultimate Oscillator</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    WILLR - Williams' %R</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    </span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    Overlap Studies</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    -----------------------------------------</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    BBANDS - Bollinger Bands</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    DEMA - Double Exponential Moving Average</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    EMA - Exponential Moving Average</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    HT_TRENDLINE - Hilbert Transform - Instantaneous Trendline</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    KAMA - Kaufman Adaptive Moving Average</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MA - Moving average</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MAMA - MESA Adaptive Moving Average</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MAVP - Moving average with variable period</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MIDPOINT - MidPoint over period</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MIDPRICE - Midpoint Price over period</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    SAR - Parabolic SAR</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    SAREXT - Parabolic SAR - Extended</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    SMA - Simple Moving Average</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    T3 - Triple Exponential Moving Average (T3)</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    TEMA - Triple Exponential Moving Average</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    TRIMA - Triangular Moving Average</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    WMA - Weighted Moving Average</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    </span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    Pattern Recognition</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    -----------------------------------------</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDL2CROWS - Two Crows</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDL3BLACKCROWS - Three Black Crows</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDL3INSIDE - Three Inside Up/Down</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDL3LINESTRIKE - Three-Line Strike </span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDL3OUTSIDE - Three Outside Up/Down</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDL3STARSINSOUTH - Three Stars In The South</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDL3WHITESOLDIERS - Three Advancing White Soldiers</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLABANDONEDBABY - Abandoned Baby</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLADVANCEBLOCK - Advance Block</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLBELTHOLD - Belt-hold</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLBREAKAWAY - Breakaway</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLCLOSINGMARUBOZU - Closing Marubozu</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLCONCEALBABYSWALL - Concealing Baby Swallow</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLCOUNTERATTACK - Counterattack</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLDARKCLOUDCOVER - Dark Cloud Cover</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLDOJI - Doji</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLDOJISTAR - Doji Star</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLDRAGONFLYDOJI - Dragonfly Doji</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLENGULFING - Engulfing Pattern</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLEVENINGDOJISTAR - Evening Doji Star</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLEVENINGSTAR - Evening Star</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLGAPSIDESIDEWHITE - Up/Down-gap side-by-side white lines</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLGRAVESTONEDOJI - Gravestone Doji</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLHAMMER - Hammer</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLHANGINGMAN - Hanging Man</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLHARAMI - Harami Pattern</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLHARAMICROSS - Harami Cross Pattern</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLHIGHWAVE - High-Wave Candle</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLHIKKAKE - Hikkake Pattern</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLHIKKAKEMOD - Modified Hikkake Pattern</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLHOMINGPIGEON - Homing Pigeon</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLIDENTICAL3CROWS - Identical Three Crows</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLINNECK - In-Neck Pattern</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLINVERTEDHAMMER - Inverted Hammer</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLKICKING - Kicking</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLKICKINGBYLENGTH - Kicking - bull/bear determined by the longer marubozu</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLLADDERBOTTOM - Ladder Bottom</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLLONGLEGGEDDOJI - Long Legged Doji</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLLONGLINE - Long Line Candle</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLMARUBOZU - Marubozu</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLMATCHINGLOW - Matching Low</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLMATHOLD - Mat Hold</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLMORNINGDOJISTAR - Morning Doji Star</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLMORNINGSTAR - Morning Star</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLONNECK - On-Neck Pattern</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLPIERCING - Piercing Pattern</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLRICKSHAWMAN - Rickshaw Man</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLRISEFALL3METHODS - Rising/Falling Three Methods</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLSEPARATINGLINES - Separating Lines</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLSHOOTINGSTAR - Shooting Star</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLSHORTLINE - Short Line Candle</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLSPINNINGTOP - Spinning Top</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLSTALLEDPATTERN - Stalled Pattern</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLSTICKSANDWICH - Stick Sandwich</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLTAKURI - Takuri (Dragonfly Doji with very long lower shadow)</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLTASUKIGAP - Tasuki Gap</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLTHRUSTING - Thrusting Pattern</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLTRISTAR - Tristar Pattern</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLUNIQUE3RIVER - Unique 3 River</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLUPSIDEGAP2CROWS - Upside Gap Two Crows</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CDLXSIDEGAP3METHODS - Upside/Downside Gap Three Methods</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    </span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    Price Transform</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    -----------------------------------------</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    AVGPRICE - Average Price</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    MEDPRICE - Median Price</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    TYPPRICE - Typical Price</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    WCLPRICE - Weighted Close Price</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    </span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    Statistic Functions</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    -----------------------------------------</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    BETA - Beta</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    CORREL - Pearson's Correlation Coefficient (r)</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    LINEARREG - Linear Regression</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    LINEARREG_ANGLE - Linear Regression Angle</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    LINEARREG_INTERCEPT - Linear Regression Intercept</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    LINEARREG_SLOPE - Linear Regression Slope</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    STDDEV - Standard Deviation</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    TSF - Time Series Forecast</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    VAR - Variance</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    </span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    Volatility Indicators</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    -----------------------------------------</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ATR - Average True Range</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    NATR - Normalized Average True Range</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    TRANGE - True Range</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    </span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    Volume Indicators</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    -----------------------------------------</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    AD - Chaikin A/D Line</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    ADOSC - Chaikin A/D Oscillator</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    OBV - On Balance Volume</span></span>\n<span class=\"line\"><span style=\"color: #b392f0\">    </span></span></code></pre>");

				const frontmatter = {"title":"TA-Lib Functions"};
				const file = "/mnt/ext4/Home/neoarttec/Archives/Linux/Crypto/Trading/Mercury/MercuryTrader/component-module-tests/TradeX/tradex-chart/src/docs/src/content/docs/reference/indicators_talib.md";
				const url = undefined;
				function rawContent() {
					return "\n[TA-Lib](https://github.com/TA-Lib/ta-lib) is widely used by trading software developers requiring to perform technical analysis of financial market data.\n\nA list of TA-Lib functions that have been implemented in TradeX-chart as indicators is found in [indicators_default.md](indicators_default.md)\n\nThe functions are accessible directly through the chart api.\n\n```javascript\nchart.TALib.SUM()\n```\nThe description of each function, it's parameters, return values and defaults are currently found in [talib-api.js](../src/definitions/talib-api.js) or [talib-api.json](../src/definitions/talib-api.json) files and may be directly imported from TradeX-chart to assist with building your own indicators.\n\n\n## Function List\n\n```\n\n    Cycle Indicators\n    -----------------------------------------\n    HT_DCPERIOD - Hilbert Transform - Dominant Cycle Period\n    HT_DCPHASE - Hilbert Transform - Dominant Cycle Phase\n    HT_PHASOR - Hilbert Transform - Phasor Components\n    HT_SINE - Hilbert Transform - SineWave\n    HT_TRENDMODE - Hilbert Transform - Trend vs Cycle Mode\n    \n    Math Operators\n    -----------------------------------------\n    ADD - Vector Arithmetic Add\n    DIV - Vector Arithmetic Div\n    MAX - Highest value over a specified period\n    MAXINDEX - Index of highest value over a specified period\n    MIN - Lowest value over a specified period\n    MININDEX - Index of lowest value over a specified period\n    MINMAX - Lowest and highest values over a specified period\n    MINMAXINDEX - Indexes of lowest and highest values over a specified period\n    MULT - Vector Arithmetic Mult\n    SUB - Vector Arithmetic Substraction\n    SUM - Summation\n    \n    Math Transform\n    -----------------------------------------\n    ACOS - Vector Trigonometric ACos\n    ASIN - Vector Trigonometric ASin\n    ATAN - Vector Trigonometric ATan\n    CEIL - Vector Ceil\n    COS - Vector Trigonometric Cos\n    COSH - Vector Trigonometric Cosh\n    EXP - Vector Arithmetic Exp\n    FLOOR - Vector Floor\n    LN - Vector Log Natural\n    LOG10 - Vector Log10\n    SIN - Vector Trigonometric Sin\n    SINH - Vector Trigonometric Sinh\n    SQRT - Vector Square Root\n    TAN - Vector Trigonometric Tan\n    TANH - Vector Trigonometric Tanh\n    \n    Momentum Indicators\n    -----------------------------------------\n    ADX - Average Directional Movement Index\n    ADXR - Average Directional Movement Index Rating\n    APO - Absolute Price Oscillator\n    AROON - Aroon\n    AROONOSC - Aroon Oscillator\n    BOP - Balance Of Power\n    CCI - Commodity Channel Index\n    CMO - Chande Momentum Oscillator\n    DX - Directional Movement Index\n    MACD - Moving Average Convergence/Divergence\n    MACDEXT - MACD with controllable MA type\n    MACDFIX - Moving Average Convergence/Divergence Fix 12/26\n    MFI - Money Flow Index\n    MINUS_DI - Minus Directional Indicator\n    MINUS_DM - Minus Directional Movement\n    MOM - Momentum\n    PLUS_DI - Plus Directional Indicator\n    PLUS_DM - Plus Directional Movement\n    PPO - Percentage Price Oscillator\n    ROC - Rate of change : ((price/prevPrice)-1)*100\n    ROCP - Rate of change Percentage: (price-prevPrice)/prevPrice\n    ROCR - Rate of change ratio: (price/prevPrice)\n    ROCR100 - Rate of change ratio 100 scale: (price/prevPrice)*100\n    RSI - Relative Strength Index\n    STOCH - Stochastic\n    STOCHF - Stochastic Fast\n    STOCHRSI - Stochastic Relative Strength Index\n    TRIX - 1-day Rate-Of-Change (ROC) of a Triple Smooth EMA\n    ULTOSC - Ultimate Oscillator\n    WILLR - Williams' %R\n    \n    Overlap Studies\n    -----------------------------------------\n    BBANDS - Bollinger Bands\n    DEMA - Double Exponential Moving Average\n    EMA - Exponential Moving Average\n    HT_TRENDLINE - Hilbert Transform - Instantaneous Trendline\n    KAMA - Kaufman Adaptive Moving Average\n    MA - Moving average\n    MAMA - MESA Adaptive Moving Average\n    MAVP - Moving average with variable period\n    MIDPOINT - MidPoint over period\n    MIDPRICE - Midpoint Price over period\n    SAR - Parabolic SAR\n    SAREXT - Parabolic SAR - Extended\n    SMA - Simple Moving Average\n    T3 - Triple Exponential Moving Average (T3)\n    TEMA - Triple Exponential Moving Average\n    TRIMA - Triangular Moving Average\n    WMA - Weighted Moving Average\n    \n    Pattern Recognition\n    -----------------------------------------\n    CDL2CROWS - Two Crows\n    CDL3BLACKCROWS - Three Black Crows\n    CDL3INSIDE - Three Inside Up/Down\n    CDL3LINESTRIKE - Three-Line Strike \n    CDL3OUTSIDE - Three Outside Up/Down\n    CDL3STARSINSOUTH - Three Stars In The South\n    CDL3WHITESOLDIERS - Three Advancing White Soldiers\n    CDLABANDONEDBABY - Abandoned Baby\n    CDLADVANCEBLOCK - Advance Block\n    CDLBELTHOLD - Belt-hold\n    CDLBREAKAWAY - Breakaway\n    CDLCLOSINGMARUBOZU - Closing Marubozu\n    CDLCONCEALBABYSWALL - Concealing Baby Swallow\n    CDLCOUNTERATTACK - Counterattack\n    CDLDARKCLOUDCOVER - Dark Cloud Cover\n    CDLDOJI - Doji\n    CDLDOJISTAR - Doji Star\n    CDLDRAGONFLYDOJI - Dragonfly Doji\n    CDLENGULFING - Engulfing Pattern\n    CDLEVENINGDOJISTAR - Evening Doji Star\n    CDLEVENINGSTAR - Evening Star\n    CDLGAPSIDESIDEWHITE - Up/Down-gap side-by-side white lines\n    CDLGRAVESTONEDOJI - Gravestone Doji\n    CDLHAMMER - Hammer\n    CDLHANGINGMAN - Hanging Man\n    CDLHARAMI - Harami Pattern\n    CDLHARAMICROSS - Harami Cross Pattern\n    CDLHIGHWAVE - High-Wave Candle\n    CDLHIKKAKE - Hikkake Pattern\n    CDLHIKKAKEMOD - Modified Hikkake Pattern\n    CDLHOMINGPIGEON - Homing Pigeon\n    CDLIDENTICAL3CROWS - Identical Three Crows\n    CDLINNECK - In-Neck Pattern\n    CDLINVERTEDHAMMER - Inverted Hammer\n    CDLKICKING - Kicking\n    CDLKICKINGBYLENGTH - Kicking - bull/bear determined by the longer marubozu\n    CDLLADDERBOTTOM - Ladder Bottom\n    CDLLONGLEGGEDDOJI - Long Legged Doji\n    CDLLONGLINE - Long Line Candle\n    CDLMARUBOZU - Marubozu\n    CDLMATCHINGLOW - Matching Low\n    CDLMATHOLD - Mat Hold\n    CDLMORNINGDOJISTAR - Morning Doji Star\n    CDLMORNINGSTAR - Morning Star\n    CDLONNECK - On-Neck Pattern\n    CDLPIERCING - Piercing Pattern\n    CDLRICKSHAWMAN - Rickshaw Man\n    CDLRISEFALL3METHODS - Rising/Falling Three Methods\n    CDLSEPARATINGLINES - Separating Lines\n    CDLSHOOTINGSTAR - Shooting Star\n    CDLSHORTLINE - Short Line Candle\n    CDLSPINNINGTOP - Spinning Top\n    CDLSTALLEDPATTERN - Stalled Pattern\n    CDLSTICKSANDWICH - Stick Sandwich\n    CDLTAKURI - Takuri (Dragonfly Doji with very long lower shadow)\n    CDLTASUKIGAP - Tasuki Gap\n    CDLTHRUSTING - Thrusting Pattern\n    CDLTRISTAR - Tristar Pattern\n    CDLUNIQUE3RIVER - Unique 3 River\n    CDLUPSIDEGAP2CROWS - Upside Gap Two Crows\n    CDLXSIDEGAP3METHODS - Upside/Downside Gap Three Methods\n    \n    Price Transform\n    -----------------------------------------\n    AVGPRICE - Average Price\n    MEDPRICE - Median Price\n    TYPPRICE - Typical Price\n    WCLPRICE - Weighted Close Price\n    \n    Statistic Functions\n    -----------------------------------------\n    BETA - Beta\n    CORREL - Pearson's Correlation Coefficient (r)\n    LINEARREG - Linear Regression\n    LINEARREG_ANGLE - Linear Regression Angle\n    LINEARREG_INTERCEPT - Linear Regression Intercept\n    LINEARREG_SLOPE - Linear Regression Slope\n    STDDEV - Standard Deviation\n    TSF - Time Series Forecast\n    VAR - Variance\n    \n    Volatility Indicators\n    -----------------------------------------\n    ATR - Average True Range\n    NATR - Normalized Average True Range\n    TRANGE - True Range\n    \n    Volume Indicators\n    -----------------------------------------\n    AD - Chaikin A/D Line\n    ADOSC - Chaikin A/D Oscillator\n    OBV - On Balance Volume\n    \n```\n\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"function-list","text":"Function List"}];
				}
				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return contentFragment;
				}
				Content[Symbol.for('astro.needsHeadRendering')] = true;

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, images, rawContent, url };