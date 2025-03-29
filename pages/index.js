import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: "#fffaf2", // 오프화이트 배경
        minHeight: "100vh",
        padding: "60px 20px",
        fontFamily: "sans-serif",
        textAlign: "center",
        color: "#432818"
      }}
    >
      {/* 상단 네비게이션 */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff0d6",
          padding: "12px 24px",
          borderBottom: "1px solid #e0c7a3",
          fontSize: "14px"
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "20px" }}>온마루펫</div>
        <div style={{ display: "flex", gap: "16px" }}>
          <button>강아지</button>
          <button>고양이</button>
          <button>브랜드소개</button>
          <button>고객센터</button>
          <button
            onClick={() => router.push("/admin")}
            style={{
              backgroundColor: "#ffb347",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none"
            }}
          >
            관리자
          </button>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <div style={{ marginTop: 80 }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🐶</div>
        <h1 style={{ fontSize: 36, fontWeight: "bold", marginBottom: 16 }}>자연을 담은 정직한 간식</h1>
        <p style={{ fontSize: 16, color: "#6a4e33" }}>
          장어 부산물로 만든 고단백 반려견 간식 정기배송
        </p>

        <div
          style={{
            display: "inline-block",
            backgroundColor: "#ffe9c4",
            color: "#432818",
            marginTop: 30,
            padding: "10px 24px",
            borderRadius: "30px",
            fontSize: 14,
            fontWeight: 500
          }}
        >
          신규 가입 시 10% 할인 혜택!
        </div>
      </div>

      {/* 하단 푸터 */}
      <footer style={{ marginTop: 100, fontSize: 12, color: "#6a4e33" }}>
        © 2025 온마루펫 | 프리미엄 반려동물 정기배송 플랫폼
      </footer>
    </div>
  );
}
