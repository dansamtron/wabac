import { Link } from "react-router-dom"

export default function Checkout() {
  return (
    <div className="min-h-[60vh] bg-[#FFFBF5] grid place-items-center px-4 py-10">
      <div className="max-w-md text-center rounded-[22px] bg-white border border-[#F3E6D3] p-8">
        <h1 className="font-display text-2xl font-bold">Checkout continues on WhatsApp</h1>
        <p className="mt-2 text-sm leading-6 text-[#5a5a5a]">Cognicart keeps pricing honest. AI re-checks your cart, stock and delivery fee inside WhatsApp, then creates the order with Paystack when you confirm.</p>
        <div className="mt-4 rounded-2xl bg-[#E6F7F1] border border-[#0B9C74]/20 p-4 text-left text-sm">
          <div className="font-bold">Next step</div>
          <div className="text-[#5a5a5a]">Message the seller on WhatsApp: "Hi, I want to checkout my cart."</div>
        </div>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="https://wa.me/2340000000000" target="_blank" rel="noreferrer" className="rounded-full bg-[#0B9C74] px-6 py-3 text-sm font-bold text-white hover:bg-[#0a8a66]">Open WhatsApp</a>
          <Link to="/store" className="rounded-full bg-white border border-[#F3E6D3] px-6 py-3 text-sm font-bold hover:bg-[#FFF1DA]">Back to store</Link>
        </div>
      </div>
    </div>
  )
}
