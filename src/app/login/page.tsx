import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const errorMessage = searchParams?.error;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        redirect("/portal/dashboard");
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-md border border-stone/30 p-8 bg-washi">
                <h1 className="font-serif text-3xl mb-4 text-sumi text-center">
                    Collector Portal
                </h1>

                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 text-red-900 border border-red-200 text-sm">
                        登入失敗：{errorMessage}
                        <br />
                        <span className="text-xs opacity-70">請確認帳號密碼正確，並且已經在 Supabase 中完成驗證 (Auto Confirm)。</span>
                    </div>
                )}

                <form className="space-y-6" action="/auth/login" method="post">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-sumi/60 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full bg-transparent border-b border-stone/50 py-2 focus:outline-none focus:border-sumi transition-colors"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-sumi/60 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full bg-transparent border-b border-stone/50 py-2 focus:outline-none focus:border-sumi transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-sumi text-washi py-3 font-medium hover:bg-sumi/90 transition-colors"
                    >
                        登入 Login
                    </button>
                    <p className="text-center text-xs text-sumi/50 mt-4">
                        還不是藏家會員？請透過畫廊邀請碼註冊。
                    </p>
                </form>
            </div>
        </main>
    );
}
