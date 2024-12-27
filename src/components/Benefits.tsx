import { Check } from 'lucide-react'

export function Benefits() {
  return (
    <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
          Benefits
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Transform your health journey with our comprehensive wellness platform
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <Check className="h-12 w-12 text-green-500" />
            <div className="space-y-2">
              <h3 className="font-bold">Accurate Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Get precise nutritional information with our AI-powered food recognition
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <Check className="h-12 w-12 text-green-500" />
            <div className="space-y-2">
              <h3 className="font-bold">Personalized Plans</h3>
              <p className="text-sm text-muted-foreground">
                Receive customized wellness plans based on your goals and preferences
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <Check className="h-12 w-12 text-green-500" />
            <div className="space-y-2">
              <h3 className="font-bold">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your health journey with detailed analytics and insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


