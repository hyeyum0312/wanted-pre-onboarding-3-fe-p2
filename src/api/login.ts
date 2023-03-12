import { BASE_URL } from './const'
import { getAccessTokenFromLocalStorage, saveAccessTokenToLocalStorage } from '../utils/accessTokenHandler'
import { UserInfo } from '../types/user'
import { fetchClient } from './fetchClient'

type LoginResult = 'success' | 'fail'


/***
 * type 형태 성공 or 실패
 * ***/
export type LoginResultWithToken = {
    result: 'success'
    access_token: string
} | {
    result: 'fail'
    access_token: null
}

/***
 * interface 형태
 * ***/
export interface LoginRequest {
    username: string
    password: string
}

// 아이디,비번을 api에 보내서 ok가 true인 경우 상태와,토큰을 아닌경우 null을 리턴한다.
export const loginWithToken = async (args: LoginRequest): Promise<LoginResultWithToken> => {
    console.log('args',args)
    const loginRes = await fetch(`${ BASE_URL }/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });

    if (loginRes.ok) {
        const loginResponseData = await loginRes.json()
        console.log('loginResponseData',loginResponseData)
        return {
            result: 'success',
            access_token: loginResponseData.access_token
        }
    }

    return {
        result: 'fail',
        access_token: null
    }
}

export const login = async (args: LoginRequest): Promise<LoginResult> => {
    const loginRes = await fetch(`${ BASE_URL }/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    })

    if (loginRes.ok) {
        const loginResponseData = await loginRes.json()
        saveAccessTokenToLocalStorage(loginResponseData.access_token)
        return 'success'
    }
    return 'fail'
}

export const getCurrentUserInfoWithToken = async (token: string): Promise<UserInfo | null> => {
    const userInfoRes = await fetch(`${ BASE_URL }/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`
        }
    })

    if (userInfoRes.ok) {
        return userInfoRes.json() as Promise<UserInfo>
    }

    return null
}
// 유저 인포를 get 한다.
// userInfoRes가 ok인 경우 UserInfo를 리턴한다.
export const getCurrentUserInfo = async (): Promise<UserInfo | null> => {
    const userInfoRes = await fetchClient(
        `${ BASE_URL }/profile`,
        { method: 'GET' }
    )
    console.log('userInfoRes >>',userInfoRes);

    if (userInfoRes.ok) {
        return userInfoRes.json() as Promise<UserInfo>
    }

    return null
}
