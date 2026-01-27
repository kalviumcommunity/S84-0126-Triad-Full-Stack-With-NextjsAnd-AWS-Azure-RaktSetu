import Navbar from "@/components/navbar";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import RolesSection from "@/components/RolesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
      }}
    >
      <Navbar />

      {/* HERO SECTION */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: "calc(100vh - 80px)",
          padding: "80px 40px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* LEFT CONTENT */}
        <div style={{ flex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "8px 16px",
              borderRadius: "999px",
              marginBottom: "24px",
              fontWeight: 500,
            }}
          >
            ❤️ Every drop counts. Every life matters.
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "24px",
              color: "#000000",
            }}
          >
            Connecting <span style={{ color: "#dc2626" }}>Lives</span>
            <br />
            One Donation at a Time
          </h1>

          {/* Description */}
          <p
            style={{
              maxWidth: "600px",
              fontSize: "18px",
              color: "#4b5563",
              marginBottom: "32px",
            }}
          >
            Raktsetu is India&apos; real-time blood donation platform,
            seamlessly connecting donors, hospitals, and NGOs to save lives when
            every second counts.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "48px" }}>
            <button
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                padding: "14px 28px",
                borderRadius: "12px",
                border: "none",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Register as Donor →
            </button>

            <button
              style={{
                backgroundColor: "transparent",
                color: "#dc2626",
                padding: "14px 28px",
                borderRadius: "12px",
                border: "2px solid #dc2626",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Request Blood
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", color: "#000000", gap: "40px" }}>
            <Stat value="50K+" label="Active Donors" />
            <Stat value="500+" label="Partner Hospitals" />
            <Stat value="100K+" label="Lives Saved" />
          </div>
        </div>

        {/* RIGHT GRADIENT / IMAGE */}
        <div
          style={{
            flex: 1,
            height: "500px",
            backgroundImage:
              "radial-gradient(circle at center, rgba(255,255,255,0.3), rgba(255,230,230,0.9)), url('/images/blood.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
          }}
        />
      </section>
      <HowItWorks />
      <Features />
      <RolesSection />
      <Footer />
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          backgroundColor: "#fee2e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#dc2626",
          fontWeight: 700,
        }}
      >
        ❤
      </div>
      <div>
        <div style={{ fontWeight: 700 }}>{value}</div>
        <div style={{ fontSize: "14px", color: "#6b7280" }}>{label}</div>
      </div>
    </div>
  );
}
