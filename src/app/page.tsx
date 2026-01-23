import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        backgroundColor: "#fff",
      }}
    >
      {/* Brand */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          fontSize: 20,
          fontWeight: 700,
          color: "#e11d48",
        }}
      >
        RaktSetu
      </div>

      {/* Wrapper */}
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "60px",
        }}
      >
        {/* LEFT SIDE – IMAGE */}
        <div style={{ flex: 1 }}>
          <Image
            src="/images/blood.png"
            alt="Blood Donation"
            width={700}
            height={560}
            style={{ width: "100%", height: "auto", maxWidth: 700 }}
            priority
          />
        </div>

        {/* RIGHT SIDE – TEXT */}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "700",
              color: "#e11d48",
              marginBottom: "20px",
            }}
          >
            Donate Blood, Save Lives
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#444",
              lineHeight: "1.6",
              marginBottom: "30px",
            }}
          >
            RaktSetu connects blood donors with those in need, making emergency
            blood access faster, reliable, and transparent.
          </p>

          {/* BUTTONS */}
          <div style={{ display: "flex", gap: "16px" }}>
            <Link
              href="/dashboard"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                fontSize: "16px",
                backgroundColor: "#e11d48",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                textDecoration: "none",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Go to Dashboard
            </Link>

            <Link
              href="/signup"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                fontSize: "16px",
                backgroundColor: "transparent",
                color: "#e11d48",
                border: "2px solid #e11d48",
                borderRadius: "8px",
                textDecoration: "none",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
