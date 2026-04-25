export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        className="flex items-center justify-center gap-3 py-3 border border-[#c7c4d8]/40 rounded-xl hover:bg-[#eff4ff] transition-colors duration-300"
      >
        <img
          alt="Google"
          className="w-5 h-5"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF4OjUNUaJV4a_VxaHC3oEfngMR27hTN4EUVHRSjSJNlCaZfRrVlDdLPwJ6yfGzMO0o8VKsmO3xW7o5rQS3joDspagVUdgBeq2ZHiJbGqiwPaJcmPJPHA4DkOt90MrGnpQoaM-32dLMVwt9sUiCHW2mIgS0BewQP-PO5S2G_3_NlVh3WABIZgJTdv1OZhO8oX79iQN_xtPNbc4_-hoFI2-ZeSHjerzTWoZ3PaqtcoKcP4s36aTf6abQPwqh5pjqFRDR8Zfh6fFzOg"
        />
        <span className="text-sm font-bold text-[#232830]">Google</span>
      </button>

      <button
        type="button"
        className="flex items-center justify-center gap-3 py-3 border border-[#c7c4d8]/40 rounded-xl hover:bg-[#eff4ff] transition-colors duration-300"
      >
        <img
          alt="Apple"
          className="w-5 h-5"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5vpkb2Q66lNpg4XA_JBLYAWC-aIyvSf3cCUeL3HINc4eAnKg_b8C_LqXq5a2Qz1fcPLw0NIdphzW4RTHI_NI2J-fvxEIaUWbschSy3Ult2mzsxz8N6sC9TXOiEgfoH_oCg8P8jbg-8763xcs-MItEDFEnO7ykdr2q7eMzPo0qou-FJP5OroltBMcYQemIke57Js-MKOebi8bs2q7Fmun3nuSHWnEJui38iYLpIeto_sJ3ib2cRGfZAnTYYXynwSGcsS2mZJ_RNGg"
        />
        <span className="text-sm font-bold text-[#232830]">Apple</span>
      </button>
    </div>
  );
}