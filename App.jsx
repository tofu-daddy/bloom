import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CANVAS_SIZE = 200;

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function PlantedFlower({ flower, index }) {
    const size = 44 + (flower.size || 0) * 16;
    return (
        <div
            style={{
                position: "absolute",
                left: `${flower.x}%`,
                bottom: `${flower.y}%`,
                width: size,
                transform: "translateX(-50%)",
                animation: `sprout 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${(index * 0.04) % 0.8}s both`,
                cursor: "default",
                zIndex: Math.round(100 - flower.y),
            }}
            title={flower.date ? `Planted ${new Date(flower.date).toLocaleDateString()}` : "A flower"}
        >
            {/* Stem */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 2,
                    height: size * 0.45,
                    background: "linear-gradient(to top, #5a7a4a, #7a9a6a)",
                    borderRadius: 1,
                    opacity: 0.7,
                }}
            />
            {/* Flower drawing */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "100%",
                }}
            >
                <img
                    src={flower.data_url}
                    alt="A hand-drawn flower"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        imageRendering: "auto",
                        borderRadius: "50%",
                        filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.08))`,
                    }}
                />
            </div>
        </div>
    );
}

function DrawingCanvas({ onPublish, onCancel }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#E8677D");
    const [brushSize, setBrushSize] = useState(4);
    const lastPos = useRef(null);

    const colors = [
        "#E8677D", "#F4A3B5", "#D94F72",
        "#F2C14E", "#F7E174",
        "#A78BDB", "#C4A6E8",
        "#5BA4CF", "#7DC4E0",
        "#6DBE6D", "#3D7A3D",
        "#F5F0E8",
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    }, []);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = CANVAS_SIZE / rect.width;
        const scaleY = CANVAS_SIZE / rect.height;
        if (e.touches) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY,
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const startDraw = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        setHasDrawn(true);
        const pos = getPos(e);
        lastPos.current = pos;
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = selectedColor;
        ctx.fill();
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const ctx = canvasRef.current.getContext("2d");
        const pos = getPos(e);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushSize;
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPos.current = pos;
    };

    const stopDraw = () => {
        setIsDrawing(false);
        lastPos.current = null;
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        setHasDrawn(false);
    };

    const handlePublish = () => {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        onPublish(dataUrl);
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(16px)",
                animation: "fadeIn 0.25s ease-out",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <div
                style={{
                    background: "#FDFCF9",
                    borderRadius: 20,
                    padding: "28px 24px 24px",
                    maxWidth: 330,
                    width: "90vw",
                    animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
                }}
            >
                <h2
                    style={{
                        fontFamily: "'Instrument Serif', serif",
                        color: "#2a2a2a",
                        fontSize: 24,
                        fontWeight: 400,
                        margin: "0 0 2px",
                        textAlign: "center",
                    }}
                >
                    Draw your flower
                </h2>
                <p
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "#aaa",
                        fontSize: 12.5,
                        margin: "0 0 18px",
                        textAlign: "center",
                        fontWeight: 400,
                    }}
                >
                    it'll be planted in the garden
                </p>

                {/* Canvas */}
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        paddingBottom: "100%",
                        borderRadius: 14,
                        overflow: "hidden",
                        background: "#F7F5F0",
                        border: "1px solid #EDEBE6",
                        marginBottom: 14,
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_SIZE}
                        height={CANVAS_SIZE}
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            cursor: "crosshair",
                            touchAction: "none",
                        }}
                        onMouseDown={startDraw}
                        onMouseMove={draw}
                        onMouseUp={stopDraw}
                        onMouseLeave={stopDraw}
                        onTouchStart={startDraw}
                        onTouchMove={draw}
                        onTouchEnd={stopDraw}
                    />
                    {!hasDrawn && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                                color: "#ccc",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: 13,
                            }}
                        >
                            draw here
                        </div>
                    )}
                </div>

                {/* Color picker */}
                <div style={{ display: "flex", gap: 5, marginBottom: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    {colors.map((c) => (
                        <button
                            key={c}
                            onClick={() => setSelectedColor(c)}
                            style={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: c,
                                border: selectedColor === c ? "2.5px solid #2a2a2a" : "2px solid #e5e2dc",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                transform: selectedColor === c ? "scale(1.2)" : "scale(1)",
                                padding: 0,
                                outline: "none",
                            }}
                        />
                    ))}
                </div>

                {/* Brush size */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, justifyContent: "center" }}>
                    <span style={{ color: "#bbb", fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}>thin</span>
                    <input
                        type="range"
                        min={1}
                        max={14}
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        style={{ width: 90, accentColor: "#999" }}
                    />
                    <span style={{ color: "#bbb", fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}>thick</span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={clearCanvas}
                        style={{
                            flex: 1,
                            padding: "11px 0",
                            borderRadius: 10,
                            border: "1px solid #E5E2DC",
                            background: "#fff",
                            color: "#999",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            cursor: "pointer",
                        }}
                    >
                        Clear
                    </button>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: "11px 0",
                            borderRadius: 10,
                            border: "1px solid #E5E2DC",
                            background: "#fff",
                            color: "#999",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={!hasDrawn}
                        style={{
                            flex: 2,
                            padding: "11px 0",
                            borderRadius: 10,
                            border: "none",
                            background: hasDrawn ? "#2a2a2a" : "#E5E2DC",
                            color: hasDrawn ? "#fff" : "#bbb",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: hasDrawn ? "pointer" : "not-allowed",
                            transition: "all 0.2s",
                        }}
                    >
                        Plant it
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [flowers, setFlowers] = useState([]);
    const [showDrawing, setShowDrawing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [justPlanted, setJustPlanted] = useState(false);
    const [flowerCount, setFlowerCount] = useState(0);

    useEffect(() => {
        loadFlowers();
    }, []);

    const loadFlowers = async () => {
        try {
            const { data, error } = await supabase
                .from('flowers')
                .select('*')
                .order('date', { ascending: true });

            if (error) throw error;

            if (data) {
                setFlowers(data);
                setFlowerCount(data.length);
            }
        } catch (e) {
            console.error("Supabase load error:", e.message);
        }
        setLoading(false);
    };

    const publishFlower = async (dataUrl) => {
        const newFlower = {
            id: generateId(),
            data_url: dataUrl,
            x: 6 + Math.random() * 88,
            y: 4 + Math.random() * 52,
            size: Math.random(),
            date: new Date().toISOString(),
        };

        try {
            const { error } = await supabase
                .from('flowers')
                .insert([newFlower]);

            if (error) throw error;

            // Optimistic update
            setFlowers(prev => [...prev, newFlower]);
            setFlowerCount(prev => prev + 1);
            setShowDrawing(false);
            setJustPlanted(true);
            setTimeout(() => setJustPlanted(false), 3000);
        } catch (e) {
            console.error("Supabase insert error:", e);
            alert(`Failed to plant flower: ${e.message || "Unknown error"}. Make sure the database table is created with a 'data_url' column!`);
        }
    };

    return (
        <div
            className="garden-container"
            style={{
                position: "fixed",
                inset: 0,
                overflow: "hidden",
                fontFamily: "'DM Sans', sans-serif",
                background: "#FDFCF9",
            }}
        >
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes sprout {
          from { opacity: 0; transform: translateX(-50%) scaleY(0); transform-origin: bottom center; }
          to { opacity: 1; transform: translateX(-50%) scaleY(1); transform-origin: bottom center; }
        }

        @keyframes toast {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .plant-button {
          padding: 14px 40px;
          border-radius: 100px;
          border: 1px solid #D5D0C7;
          background: #fff;
          color: #2a2a2a;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateX(-50%);
        }
        .plant-button:hover {
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          transform: translateX(-50%) translateY(-2px);
        }
        .plant-button:active {
          transform: translateX(-50%) translateY(0);
        }
      `}</style>

            {/* Ground — soft gradient at the bottom */}
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "65%",
                    background: "linear-gradient(to top, #F3F0E6 0%, #F8F6F0 30%, #FAF9F5 60%, #FDFCF9 100%)",
                    zIndex: 0,
                }}
            />

            {/* Top Navigation Bar */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 60,
                    padding: "32px 40px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pointerEvents: "none",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        animation: "fadeIn 0.8s ease-out both",
                        pointerEvents: "auto",
                    }}
                >
                    <span style={{ fontSize: 14, color: "#2a2a2a" }}>✿</span>
                    <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#2a2a2a",
                        fontFamily: "'DM Sans', sans-serif"
                    }}>BLOOM</span>
                </div>

                {/* Flower Count */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#b0a99a",
                        fontSize: 13,
                        fontWeight: 400,
                        letterSpacing: "0.02em",
                        fontFamily: "'DM Sans', sans-serif",
                        animation: "fadeIn 0.8s ease-out 0.4s both",
                        pointerEvents: "auto",
                    }}
                >
                    <span style={{ fontSize: 10, color: "#D5D0C7" }}>✿</span>
                    <span>
                        {loading
                            ? "opening..."
                            : `${flowerCount} flower${flowerCount !== 1 ? "s" : ""} planted`}
                    </span>
                    <span style={{ fontSize: 10, color: "#D5D0C7" }}>✿</span>
                </div>
            </div>

            {/* Main Header Container (Centered) */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    padding: "clamp(48px, 12vh, 120px) 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    pointerEvents: "none",
                }}
            >
                <div
                    style={{
                        fontSize: 11,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "#b0a99a",
                        fontWeight: 600,
                        marginBottom: 16,
                        animation: "fadeInSlideUp 0.8s ease-out 0.1s both",
                    }}
                >
                    A Community Garden
                </div>

                <h1
                    style={{
                        fontFamily: "'Instrument Serif', serif",
                        fontSize: "clamp(44px, 8vw, 72px)",
                        fontWeight: 400,
                        color: "#2a2a2a",
                        margin: 0,
                        lineHeight: 1.1,
                        animation: "fadeInSlideUp 0.8s ease-out 0.3s both",
                        pointerEvents: "auto",
                    }}
                >
                    Leave a Flower
                </h1>
            </div>

            {/* Flowers */}
            <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
                {flowers.map((flower, i) => (
                    <PlantedFlower key={flower.id} flower={flower} index={i} />
                ))}
            </div>

            {/* Toast */}
            {justPlanted && (
                <div
                    style={{
                        position: "fixed",
                        top: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 200,
                        background: "#2a2a2a",
                        borderRadius: 100,
                        padding: "9px 22px",
                        color: "#fff",
                        fontSize: 13,
                        fontFamily: "'DM Sans', sans-serif",
                        animation: "toast 0.35s ease-out",
                        fontWeight: 400,
                    }}
                >
                    planted ✿
                </div>
            )}

            {/* Plant button — bottom center */}
            <div
                style={{
                    position: "fixed",
                    bottom: "clamp(24px, 5vh, 48px)",
                    left: "50%",
                    zIndex: 50,
                    animation: "fadeIn 1.2s ease-out 1s both",
                }}
            >
                <button
                    className="plant-button"
                    onClick={() => setShowDrawing(true)}
                >
                    Draw a Flower
                </button>
            </div>

            {/* Drawing modal */}
            {showDrawing && (
                <DrawingCanvas
                    onPublish={publishFlower}
                    onCancel={() => setShowDrawing(false)}
                />
            )}
        </div>
    );
}
