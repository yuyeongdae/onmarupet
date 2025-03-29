mport { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX");

export default function PetSubscriptionPlatform() {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("monthly");
  const [quantity, setQuantity] = useState(1);
  const [subscriptions, setSubscriptions] = useState([]);
  const [stock, setStock] = useState({ stick: 120, treat: 85, jerky: 95 });
  const [feedbacks, setFeedbacks] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    fetch("/api/subscribers").then(res => res.json()).then(setSubscriptions);
    fetch("/api/feedbacks").then(res => res.json()).then(setFeedbacks);
    fetch("/api/inquiries").then(res => res.json()).then(setInquiries);
  }, []);

  const handleSubscribe = async () => {
    const stripe = await stripePromise;
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, quantity })
    });
    const session = await res.json();
    await stripe?.redirectToCheckout({ sessionId: session.id });
  };

  const handleCancel = (email) => alert(`${email} 구독 해지 처리`);
  const handlePause = (email) => alert(`${email} 구독 일시정지 처리`);
  const sendNotification = (email) => alert(`${email}에게 알림 발송 완료`);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 space-y-16">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold mb-2">온마루펫</h1>
        <p className="text-lg">장어 부산물로 만든 프리미엄 반려동물 간식 브랜드</p>
      </header>

      {/* 제품 소개 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardContent className="p-4"><h2 className="text-xl font-semibold mb-2">스틱 간식</h2><p>장어 내장을 활용한 고단백 에너지 스틱</p></CardContent></Card>
        <Card><CardContent className="p-4"><h2 className="text-xl font-semibold mb-2">트릿 간식</h2><p>장어 껍질을 바삭하게 가공한 건강한 트릿</p></CardContent></Card>
        <Card><CardContent className="p-4"><h2 className="text-xl font-semibold mb-2">져키 간식</h2><p>저온 건조 방식으로 만든 천연 장어 져키</p></CardContent></Card>
      </section>

      {/* 정기 구독 */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">정기 구독 신청</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Select value={plan} onValueChange={setPlan}>
            <SelectItem value="monthly">월 1회 배송</SelectItem>
            <SelectItem value="biweekly">2주 1회 배송</SelectItem>
            <SelectItem value="weekly">주 1회 배송</SelectItem>
          </Select>
          <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} placeholder="수량 선택" />
          <Button onClick={handleSubscribe}>구독 신청</Button>
        </div>
      </section>

      {/* 뉴스레터 */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">소식을 가장 먼저 받아보세요</h2>
        <div className="flex justify-center gap-2 max-w-md mx-auto">
          <Input placeholder="이메일 입력" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button>등록</Button>
        </div>
      </section>

      {/* 관리자 대시보드 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">[관리자 전용] 구독/재고/후기 관리</h2>

        {/* 구독자 목록 */}
        <Card><CardContent>
          <h3 className="text-xl font-semibold mb-2">구독자 목록</h3>
          <Table><TableHead><TableRow><TableCell>이메일</TableCell><TableCell>플랜</TableCell><TableCell>수량</TableCell><TableCell>상태</TableCell><TableCell>관리</TableCell></TableRow></TableHead><TableBody>
            {subscriptions.map((sub, i) => (
              <TableRow key={i}>
                <TableCell>{sub.email}</TableCell>
                <TableCell>{sub.plan}</TableCell>
                <TableCell>{sub.quantity}</TableCell>
                <TableCell>{sub.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handlePause(sub.email)} className="mr-2">일시정지</Button>
                  <Button onClick={() => handleCancel(sub.email)} variant="destructive">해지</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody></Table>
        </CardContent></Card>

        {/* 알림 발송 */}
        <Card><CardContent>
          <h3 className="text-xl font-semibold mb-2">알림 발송</h3>
          {subscriptions.map((sub, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <span>{sub.email}</span>
              <Button onClick={() => sendNotification(sub.email)}>알림 보내기</Button>
            </div>
          ))}
        </CardContent></Card>

        {/* 재고 현황 */}
        <Card><CardContent>
          <h3 className="text-xl font-semibold mb-2">재고 현황</h3>
          {Object.entries(stock).map(([item, qty], i) => (
            <p key={i}>{item.toUpperCase()} : {qty} 개</p>
          ))}
        </CardContent></Card>

        {/* 후기 관리 */}
        <Card><CardContent>
          <h3 className="text-xl font-semibold mb-2">고객 후기</h3>
          {feedbacks.map((f, i) => (
            <div key={i} className="mb-2 border-b pb-2">
              <p><strong>{f.email}</strong>: {f.comment}</p>
            </div>
          ))}
        </CardContent></Card>

        {/* 통계 */}
        <Card><CardContent>
          <h3 className="text-xl font-semibold mb-2">간단 통계</h3>
          <p>총 구독자 수: {subscriptions.length}</p>
          <p>가장 인기 있는 플랜: 월 1회</p>
          <p>이번 달 신규 구독: 15건</p>
        </CardContent></Card>

        {/* 자동 배송 일정 */}
        <Card><CardContent>
          <h3 className="text-xl font-semibold mb-2">자동 배송 일정</h3>
          <p>매주 수요일: 주간 구독자 배송</p>
          <p>매달 1일: 월간 구독자 배송</p>
          <p>격주 화요일: 격주 구독자 배송</p>
        </CardContent></Card>

        {/* 고객 문의 */}
        <Card><CardContent>
          <h3 className="text-xl font-semibold mb-2">고객 문의</h3>
          {inquiries.map((q, i) => (
            <div key={i} className="mb-2 border-b pb-2">
              <p><strong>{q.email}</strong>: {q.message}</p>
            </div>
          ))}
        </CardContent></Card>
      </section>

      <footer className="text-center text-sm text-gray-500 mt-20">
        © 2025 온마루펫. 모든 권리 보유.
      </footer>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginAndAutomation() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [autoEmails, setAutoEmails] = useState(false);
  const [autoDelivery, setAutoDelivery] = useState(false);

  const handleLogin = () => {
    if (email === "admin@onmarupet.com" && password === "admin123") {
      setAuth(true);
    } else {
      alert("관리자 인증 실패");
    }
  };

  const toggleAutoEmail = () => {
    setAutoEmails(!autoEmails);
    alert(`자동 이메일 발송이 ${!autoEmails ? "활성화" : "비활성화"}되었습니다.`);
  };

  const toggleAutoDelivery = () => {
    setAutoDelivery(!autoDelivery);
    alert(`자동 배송 캘린더가 ${!autoDelivery ? "활성화" : "비활성화"}되었습니다.`);
  };

  if (!auth) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">관리자 로그인</h1>
        <Input
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2"
        />
        <Input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleLogin}>로그인</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">자동화 설정</h1>
      <Card className="mb-4">
        <CardContent className="space-y-2">
          <h2 className="text-xl font-semibold">자동 이메일 발송</h2>
          <p>주문 알림, 배송 완료, 구독 갱신 알림을 자동으로 발송합니다.</p>
          <Button onClick={toggleAutoEmail}>{autoEmails ? "비활성화" : "활성화"}</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-2">
          <h2 className="text-xl font-semibold">자동 배송 캘린더</h2>
          <p>구독 주기에 따라 자동 배송 일정을 생성합니다.</p>
          <Button onClick={toggleAutoDelivery}>{autoDelivery ? "비활성화" : "활성화"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}

npm install firebase

// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=onmarupet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=onmarupet
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=onmarupet.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=XXXX
NEXT_PUBLIC_FIREBASE_APP_ID=1:XXX:web:XXX

import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, plan, quantity } = req.body;

    try {
      const docRef = await addDoc(collection(db, 'subscribers'), {
        email,
        plan,
        quantity,
        status: 'active',
        createdAt: new Date(),
      });

      res.status(200).json({ id: docRef.id });
    } catch (err) {
      res.status(500).json({ error: '저장 실패', detail: err.message });
    }
  } else {
    res.status(405).end();
  }
}
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function FaceIDLogin() {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState("대기 중...");

  useEffect(() => {
    // iOS + Safari 환경인지 체크
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (!isIOS || !window.PublicKeyCredential) {
      setAuthStatus("이 브라우저에서는 Face ID를 사용할 수 없습니다.");
    }
  }, []);

  const handleFaceIDLogin = async () => {
    try {
      setAuthStatus("Face ID 인증 시도 중...");

      // WebAuthn API - PublicKeyCredentialRequestOptions 샘플
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          allowCredentials: [],
          userVerification: "required",
        },
      });

      if (credential) {
        setAuthStatus("인증 성공! 관리자 페이지로 이동합니다.");
        router.push("/admin");
      } else {
        setAuthStatus("인증 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      setAuthStatus("Face ID 인증 실패: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Face ID 로그인</h1>
      <p className="mb-4">iOS 기기에서 Face ID로 로그인하세요.</p>
      <Button onClick={handleFaceIDLogin}>Face ID 로그인</Button>
      <p className="mt-4 text-sm text-gray-600">{authStatus}</p>
    </div>
  );
}
// /pages/api/webauthn/register-challenge.js
import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';

const userDB = {}; // 간단한 메모리 저장소 (예: userDB[email] = { id, challenge })

export async function POST(req) {
  const { email } = await req.json();
  const challenge = randomBytes(32).toString('base64url');
  const userId = randomBytes(16).toString('base64url');

  userDB[email] = { challenge, id: userId };

  const publicKeyCredentialCreationOptions = {
    challenge: Uint8Array.from(Buffer.from(challenge, 'base64url')),
    rp: { name: 'OnmaruPet' },
    user: {
      id: Uint8Array.from(Buffer.from(userId, 'base64url')),
      name: email,
      displayName: email,
    },
    pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
    timeout: 60000,
    attestation: 'none',
  };

  return NextResponse.json(publicKeyCredentialCreationOptions);
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FaceIDRegister() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleRegister = async () => {
    setStatus("등록 요청 중...");

    const res = await fetch("/api/webauthn/register-challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const options = await res.json();
    options.challenge = Uint8Array.from(options.challenge.data);
    options.user.id = Uint8Array.from(options.user.id.data);

    try {
      const credential = await navigator.credentials.create({ publicKey: options });

      // 여기서 credential.response 등을 서버로 전송해야 함 (예: /api/webauthn/verify-register)
      setStatus("Face ID 등록 성공! (서버 저장 생략됨)");
    } catch (err) {
      setStatus("등록 실패: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Face ID 등록</h2>
      <Input
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2"
      />
      <Button onClick={handleRegister}>Face ID 등록 시작</Button>
      <p className="mt-4 text-sm text-gray-600">{status}</p>
    </div>
  );
}
// /pages/api/webauthn/request-login-challenge.js
import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';

const userDB = {
  // 예시: 이메일 기반 credentialId 저장
  "admin@onmarupet.com": {
    credentialId: "base64url-encoded-credential-id",
    challenge: null
  }
};

export async function POST(req) {
  const { email } = await req.json();
  const user = userDB[email];

  if (!user || !user.credentialId) {
    return NextResponse.json({ error: "등록된 사용자가 없습니다." }, { status: 404 });
  }

  const challenge = randomBytes(32).toString("base64url");
  userDB[email].challenge = challenge;

  const requestOptions = {
    challenge: Uint8Array.from(Buffer.from(challenge, "base64url")),
    allowCredentials: [
      {
        id: Uint8Array.from(Buffer.from(user.credentialId, "base64url")),
        type: "public-key",
      },
    ],
    timeout: 60000,
    userVerification: "required",
  };

  return NextResponse.json(requestOptions);
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";

export default function FaceIDLoginClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setStatus("로그인 challenge 요청 중...");

    const res = await fetch("/api/webauthn/request-login-challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      setStatus("등록된 Face ID 정보가 없습니다.");
      return;
    }

    const options = await res.json();
    options.challenge = Uint8Array.from(options.challenge.data);
    options.allowCredentials = options.allowCredentials.map((cred) => ({
      ...cred,
      id: Uint8Array.from(cred.id.data),
    }));

    try {
      const assertion = await navigator.credentials.get({ publicKey: options });

      // 여기서 assertion.response 등을 서버로 전송하여 검증해야 함
      setStatus("Face ID 로그인 성공! 관리자 페이지로 이동합니다.");
      router.push("/admin");
    } catch (err) {
      setStatus("로그인 실패: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Face ID 로그인</h1>
      <Input
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleLogin}>Face ID 로그인 시도</Button>
      <p className="mt-4 text-sm text-gray-600">{status}</p>
    </div>
  );
}
// /pages/api/webauthn/verify-login.js
import { NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';

const mockDB = {
  "admin@onmarupet.com": {
    credentialPublicKey: "BASE64_PUBLIC_KEY",
    credentialID: "BASE64_CREDENTIAL_ID",
    challenge: "last-issued-challenge"
  }
};

export async function POST(req) {
  const body = await req.json();
  const { email, credential } = body;

  const user = mockDB[email];
  if (!user) {
    return NextResponse.json({ error: '사용자 정보 없음' }, { status: 404 });
  }

  try {
    const verified = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: user.challenge,
      expectedOrigin: "https://yourdomain.com",
      expectedRPID: "yourdomain.com",
      authenticator: {
        credentialID: Buffer.from(user.credentialID, 'base64'),
        credentialPublicKey: Buffer.from(user.credentialPublicKey, 'base64'),
        counter: 0,
        transports: ['internal'],
      },
    });

    if (verified.verified) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: '인증 실패' }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
