import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return NextResponse.redirect(`${requestUrl.origin}/login?error=Invalid login credentials`, {
            status: 301,
        })
    }

    return NextResponse.redirect(`${requestUrl.origin}/portal/dashboard`, {
        status: 301,
    })
}
