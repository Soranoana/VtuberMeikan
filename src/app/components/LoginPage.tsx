import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { AdBanner } from './AdBanner';
import { adConfig } from '../config/adConfig';

interface LoginPageProps {
  onLogin: (service: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center">
      <div className="w-full space-y-4">
        {/* 上部広告 */}
        {adConfig.loginTop && (
          <AdBanner position="login-top" variant="vertical" />
        )}

        <div className="flex flex-col items-center">
          <div className="w-full max-w-md space-y-4">
            <div className="bg-[#FFFEF8] border-2 border-[#D4C5A9] rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-[#8B7355] mb-2">ログイン</h2>
                <p className="text-sm text-[#6b6b6b]">
                  お好きなサービスのアカウントでログインしてください
                </p>
              </div>

              <div className="space-y-3">
                {/* Googleログインボタン */}
                <button
                  onClick={() => onLogin('Google')}
                  className="w-full flex items-center bg-white border-2 border-[#D4C5A9] rounded-lg px-4 py-3 hover:bg-[#F4E9D6] transition-colors"
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10.2V12.05H15.6509C15.4 13.3 14.6727 14.3591 13.5864 15.0682V17.5773H16.8182C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
                      <path d="M10.2 20C12.9 20 15.1727 19.1045 16.8182 17.5773L13.5864 15.0682C12.6636 15.6682 11.5182 16.0227 10.2 16.0227C7.59545 16.0227 5.38182 14.2636 4.56364 11.9H1.22727V14.4909C2.86364 17.7591 6.28182 20 10.2 20Z" fill="#34A853"/>
                      <path d="M4.56364 11.9C4.35455 11.3 4.23636 10.6591 4.23636 10C4.23636 9.34091 4.35455 8.7 4.56364 8.1V5.50909H1.22727C0.445455 7.05909 0 8.47727 0 10C0 11.5227 0.445455 12.9409 1.22727 14.4909L4.56364 11.9Z" fill="#FBBC04"/>
                      <path d="M10.2 3.97727C11.6364 3.97727 12.9182 4.48182 13.9182 5.42727L16.7818 2.56364C15.1682 1.04091 12.8955 0 10.2 0C6.28182 0 2.86364 2.24091 1.22727 5.50909L4.56364 8.1C5.38182 5.73636 7.59545 3.97727 10.2 3.97727Z" fill="#EA4335"/>
                    </svg>
                  </span>
                  <span className="flex-1 text-center text-[#6b6b6b]">Googleでログイン</span>
                </button>

                {/* TikTokログインボタン */}
                <button
                  onClick={() => onLogin('TikTok')}
                  className="w-full flex items-center bg-black border-2 border-black rounded-lg px-4 py-3 hover:bg-gray-900 transition-colors"
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.84 1.56V6.82a4.85 4.85 0 0 1-1.07-.13z" fill="white"/>
                    </svg>
                  </span>
                  <span className="flex-1 text-center text-white">TikTokでログイン</span>
                </button>

                {/* Twitchログインボタン */}
                <button
                  onClick={() => onLogin('Twitch')}
                  className="w-full flex items-center bg-[#9147FF] border-2 border-[#9147FF] rounded-lg px-4 py-3 hover:bg-[#7d3bde] transition-colors"
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" fill="white"/>
                    </svg>
                  </span>
                  <span className="flex-1 text-center text-white">Twitchでログイン</span>
                </button>

                {/* Xログインボタン */}
                <button
                  onClick={() => onLogin('X（旧Twitter）')}
                  className="w-full flex items-center bg-black border-2 border-black rounded-lg px-4 py-3 hover:bg-gray-900 transition-colors"
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="white"/>
                    </svg>
                  </span>
                  <span className="flex-1 text-center text-white">X（旧Twitter）でログイン</span>
                </button>

                {/* Facebookログインボタン */}
                <button
                  onClick={() => onLogin('Facebook')}
                  className="w-full flex items-center bg-[#1877F2] border-2 border-[#1877F2] rounded-lg px-4 py-3 hover:bg-[#1565d8] transition-colors"
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="white"/>
                    </svg>
                  </span>
                  <span className="flex-1 text-center text-white">Facebookでログイン</span>
                </button>

                {/* LINEログインボタン */}
                <button
                  onClick={() => onLogin('LINE')}
                  className="w-full flex items-center bg-[#06C755] border-2 border-[#06C755] rounded-lg px-4 py-3 hover:bg-[#05b34c] transition-colors"
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" fill="white"/>
                    </svg>
                  </span>
                  <span className="flex-1 text-center text-white">LINEでログイン</span>
                </button>

                {/* Discordログインボタン */}
                <button
                  onClick={() => onLogin('Discord')}
                  className="w-full flex items-center bg-[#5865F2] border-2 border-[#5865F2] rounded-lg px-4 py-3 hover:bg-[#4752c4] transition-colors"
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="white"/>
                    </svg>
                  </span>
                  <span className="flex-1 text-center text-white">Discordでログイン</span>
                </button>

                {/* Steamログインボタン */}
                <button
                  onClick={() => onLogin('Steam')}
                  className="w-full flex items-center bg-[#1b2838] border-2 border-[#1b2838] rounded-lg px-4 py-3 hover:bg-[#2a3f5f] transition-colors"
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.718L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" fill="white"/>
                    </svg>
                  </span>
                  <span className="flex-1 text-center text-white">Steamでログイン</span>
                </button>

                {/* Instagramログインボタン */}
                <button
                  onClick={() => onLogin('Instagram')}
                  className="w-full flex items-center rounded-lg px-4 py-3 transition-colors"
                  style={{ background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" fill="white"/>
                    </svg>
                  </span>
                  <span className="flex-1 text-center text-white">Instagramでログイン</span>
                </button>

                {/* ツイキャスログインボタン */}
                <button
                  onClick={() => onLogin('ツイキャス')}
                  className="w-full flex items-center bg-[#2DABE0] border-2 border-[#2DABE0] rounded-lg px-4 py-3 hover:bg-[#2196c8] transition-colors"
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="4" fill="#2DABE0"/>
                      <path d="M12 5C8.134 5 5 8.134 5 12s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 12 7zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="white"/>
                      <circle cx="18.5" cy="5.5" r="2" fill="#FF4B4B"/>
                    </svg>
                  </span>
                  <span className="flex-1 text-center text-white">ツイキャスでログイン</span>
                </button>

                {/* ニコニコログインボタン */}
                <button
                  onClick={() => onLogin('ニコニコ')}
                  className="w-full flex items-center bg-[#231815] border-2 border-[#231815] rounded-lg px-4 py-3 hover:bg-[#3a2a26] transition-colors"
                >
                  <span className="w-8 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 14.5c0 1.381-1.119 2.5-2.5 2.5h-6C7.619 17 6.5 15.881 6.5 14.5v-5C6.5 8.119 7.619 7 9 7h6c1.381 0 2.5 1.119 2.5 2.5v5z" fill="white"/>
                      <path d="M10.5 10h-1v4h1v-4zm4 0h-1v4h1v-4z" fill="#231815"/>
                    </svg>
                  </span>
                  <span className="flex-1 text-center text-white">ニコニコでログイン</span>
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-[#6b6b6b]">
                  ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 下部広告 */}
        {adConfig.loginBottom && (
          <AdBanner position="login-bottom" variant="vertical" />
        )}
      </div>
    </div>
  );
}