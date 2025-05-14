"use client"

import { useEffect, useRef, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Download, Leaf, GitBranch } from "lucide-react"
import { cn } from "@/lib/utils"

// Remove potShape and potColor from the TreeParams interface
interface TreeParams {
  trunkThickness: number
  branchDensity: number
  treeHeight: number
  leafColor: string
  leafDensity: number
  branchAngleVariation: number
  treeAge: number
  windEffect: number
}

// Update PRESETS to remove pot-related properties
const PRESETS = {
  formal: {
    trunkThickness: 15,
    branchDensity: 70,
    treeHeight: 80,
    leafColor: "#2d6a4f",
    leafDensity: 80,
    branchAngleVariation: 30,
    treeAge: 70,
    windEffect: 0,
  },
  slanting: {
    trunkThickness: 12,
    branchDensity: 60,
    treeHeight: 70,
    leafColor: "#40916c",
    leafDensity: 70,
    branchAngleVariation: 50,
    treeAge: 60,
    windEffect: 30,
  },
  cascade: {
    trunkThickness: 18,
    branchDensity: 80,
    treeHeight: 90,
    leafColor: "#1b4332",
    leafDensity: 90,
    branchAngleVariation: 70,
    treeAge: 90,
    windEffect: 10,
  },
  literati: {
    trunkThickness: 10,
    branchDensity: 40,
    treeHeight: 95,
    leafColor: "#52b788",
    leafDensity: 40,
    branchAngleVariation: 60,
    treeAge: 80,
    windEffect: 20,
  },
  forest: {
    trunkThickness: 8,
    branchDensity: 90,
    treeHeight: 75,
    leafColor: "#2d6a4f",
    leafDensity: 95,
    branchAngleVariation: 40,
    treeAge: 50,
    windEffect: 15,
  },
}

// Remove POT_COLORS and POT_SHAPES constants
const LEAF_COLORS = [
  { name: "Deep Green", value: "#1b4332" },
  { name: "Forest Green", value: "#2d6a4f" },
  { name: "Medium Green", value: "#40916c" },
  { name: "Light Green", value: "#52b788" },
  { name: "Yellow Green", value: "#95d5b2" },
  { name: "Autumn Red", value: "#b91c1c" },
  { name: "Autumn Orange", value: "#c2410c" },
  { name: "Cherry Blossom", value: "#fecdd3" },
]

export default function BonsaiGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [params, setParams] = useState<TreeParams>(PRESETS.formal)
  const [activeTab, setActiveTab] = useState("presets")

  // Update a single parameter
  const updateParam = (key: keyof TreeParams, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  // Apply a preset
  const applyPreset = (preset: keyof typeof PRESETS) => {
    setParams(PRESETS[preset])
  }

  // Update generateRandom to remove pot-related properties
  const generateRandom = () => {
    setParams({
      trunkThickness: Math.floor(Math.random() * 15) + 5,
      branchDensity: Math.floor(Math.random() * 80) + 20,
      treeHeight: Math.floor(Math.random() * 50) + 50,
      leafColor: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)].value,
      leafDensity: Math.floor(Math.random() * 80) + 20,
      branchAngleVariation: Math.floor(Math.random() * 70) + 10,
      treeAge: Math.floor(Math.random() * 80) + 20,
      windEffect: Math.floor(Math.random() * 40),
    })
  }

  // Download the bonsai as an image
  const downloadBonsai = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = "my-bonsai.png"
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  // Replace the drawPot function and update the useEffect to not draw pots
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 800
    canvas.height = 800

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#f5f5f4"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw tree
    const startX = canvas.width / 2
    const startY = canvas.height - 10 
    const angle = -90 + params.windEffect / 2

    // Draw trunk
    ctx.save()
    ctx.translate(startX, startY)
    drawBranch(ctx, 0, 0, params.treeHeight * 1.5, angle, params.trunkThickness, 0, params)
    ctx.restore()
  }, [params])

  // Recursive function to draw branches
  function drawBranch(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    length: number,
    angle: number,
    thickness: number,
    depth: number,
    params: TreeParams,
  ) {
    if (length < 5 || thickness < 0.5) return

    const { branchAngleVariation, branchDensity, leafColor, leafDensity, treeAge, windEffect } = params

    // Calculate end point
    const endX = startX + length * Math.cos((angle * Math.PI) / 180)
    const endY = startY + length * Math.sin((angle * Math.PI) / 180)

    // Draw branch
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.lineWidth = thickness

    // Branch color based on thickness (trunk vs branches)
    const colorValue = Math.min(255, 100 + thickness * 8)
    ctx.strokeStyle = `rgb(${colorValue / 2}, ${colorValue / 3}, 0)`
    ctx.stroke()

    // Determine number of sub-branches based on density and age
    const branchCount = Math.floor((branchDensity / 100) * 3) + 1
    const maxDepth = Math.floor((treeAge / 100) * 8) + 3

    // Stop branching if we've reached max depth
    if (depth >= maxDepth) return

    // Draw leaves at the end of small branches
    if (thickness < 2 && Math.random() < leafDensity / 100) {
      drawLeaves(ctx, endX, endY, leafColor, thickness * 3)
    }

    // Create sub-branches
    for (let i = 0; i < branchCount; i++) {
      // Calculate new length and thickness
      const newLength = length * (0.6 + Math.random() * 0.3)
      const newThickness = thickness * 0.7

      // Calculate new angle with variation
      let angleVariation = (Math.random() - 0.5) * branchAngleVariation

      // Add wind effect
      if (windEffect > 0) {
        angleVariation += (windEffect / 5) * (1 - depth / maxDepth)
      }

      const newAngle = angle + angleVariation

      // Draw sub-branch
      ctx.save()
      ctx.translate(endX, endY)
      drawBranch(ctx, 0, 0, newLength, newAngle, newThickness, depth + 1, params)
      ctx.restore()
    }
  }

  // Draw leaves
  function drawLeaves(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number) {
    const leafCount = Math.floor(Math.random() * 5) + 3

    for (let i = 0; i < leafCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * size
      const leafX = x + Math.cos(angle) * distance
      const leafY = y + Math.sin(angle) * distance
      const leafSize = size * (0.5 + Math.random() * 0.5)

      ctx.beginPath()
      ctx.fillStyle = color
      ctx.ellipse(leafX, leafY, leafSize, leafSize / 2, angle, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Canvas section */}
      <div className="lg:col-span-7 order-2 lg:order-1">
        <div className="relative">

          {/* Canvas container with decorative elements */}
          <div className="canvas-container bg-white relative z-10 shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
            <canvas ref={canvasRef} className="w-full h-full" />

            {/* Star decoration */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white star-shape z-20"></div>
            <div className="absolute -bottom-2 left-1/4 w-6 h-6 bg-white star-shape z-20"></div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-4 justify-center">
            <Button
              onClick={generateRandom}
              className="flex items-center gap-2 bg-forest-600 hover:bg-forest-700 rounded-full px-4 py-2 h-auto text-base font-medium shadow-lg text-white"
            >
              <RefreshCw size={16} />
              Random Bonsai
            </Button>
            <Button
              onClick={downloadBonsai}
              variant="outline"
              className="flex items-center gap-2 border-2 border-forest-600 text-forest-600 hover:bg-forest-50 rounded-full px-4 py-2 h-auto text-base font-medium"
            >
              <Download size={16} />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Controls section */}
      <div className="lg:col-span-5 order-1 lg:order-2">
        <div className="relative">
          {/* Blob shape background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-forest-600/10 blob-shape -z-10"></div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 bg-forest-800/50 p-1 rounded-full w-full max-w-xs mx-auto">
            <TabsTrigger
                value="presets"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-forest-800 text-white"
              >
                Presets
              </TabsTrigger>
              <TabsTrigger
                value="controls"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-forest-800 text-white"
              >
                Controls
              </TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="mt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                <h3 className="text-lg font-bold mb-3 text-forest-100">Bonsai Styles</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      className={cn(
                        "group relative overflow-hidden rounded-xl p-1 transition-all",
                        JSON.stringify(params) === JSON.stringify(preset)
                          ? "ring-2 ring-white shadow-lg"
                          : "hover:ring-1 hover:ring-white/50",
                      )}
                      onClick={() => applyPreset(key as keyof typeof PRESETS)}
                    >
                      <div
                        className={cn(
                          "relative z-10 bg-gradient-to-r from-forest-900/80 to-forest-800/80 rounded-lg p-3 text-left",
                          JSON.stringify(params) === JSON.stringify(preset)
                            ? "from-forest-700/90 to-forest-600/90"
                            : "group-hover:from-forest-800/90 group-hover:to-forest-700/90",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-forest-500/20 flex items-center justify-center">
                            {/* Bonsai style icon preview */}
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-7 h-7"
                            >
                              {/* Trunk */}
                              {key === "formal" && (
                                <>
                                  {/* Creative Formal Icon */}
                                  <rect x="15" y="10" width="2" height="14" rx="1" fill="#795548" /> {/* Trunk */}
                                  <ellipse cx="16" cy="8" rx="7" ry="5" fill={preset.leafColor} /> {/* Top foliage */}
                                  <rect x="11" y="13" width="10" height="1.5" rx="0.75" fill="#795548" /> {/* Branch 1 */}
                                  <ellipse cx="16" cy="13.75" rx="6" ry="3" fill={preset.leafColor} /> {/* Foliage for branch 1 */}
                                  <rect x="12" y="17" width="8" height="1.5" rx="0.75" fill="#795548" /> {/* Branch 2 */}
                                  <ellipse cx="16" cy="17.75" rx="5" ry="2.5" fill={preset.leafColor} /> {/* Foliage for branch 2 */}
                                </>
                              )}
                              {key === "slanting" && (
                                <>
                                  {/* Creative Slanting Icon */}
                                  <path d="M12 24 Q16 22 19 15 Q21 10 19 6" stroke="#795548" strokeWidth="2.5" fill="none" transform="rotate(-30 16 16)" />
                                  <ellipse cx="14" cy="10" rx="6" ry="4" fill={preset.leafColor} transform="rotate(-30 16 16) translate(-2, 0)" />
                                  <ellipse cx="12" cy="14" rx="5" ry="3" fill={preset.leafColor} transform="rotate(-30 16 16) translate(-2, 0)" />
                                </>
                              )}
                              {key === "cascade" && (
                                <>
                                  {/* Creative Cascade Icon */}
                                  <path d="M16 8 L16 15 C 16 15, 14 17, 10 19 L10 22 L22 27" stroke="#795548" strokeWidth="2.5" fill="none"/>
                                  <ellipse cx="22" cy="28" rx="6" ry="4" fill={preset.leafColor} />
                                  <ellipse cx="16" cy="24" rx="5" ry="3" fill={preset.leafColor} />
                                  <ellipse cx="10" cy="20" rx="4" ry="2.5" fill={preset.leafColor} />
                                </>
                              )}
                              {key === "literati" && (
                                <>
                                  {/* Creative Literati Icon */}
                                  <path d="M16 25 C 20 20, 12 18, 16 12 C 20 8, 15 5, 16 5" stroke="#795548" strokeWidth="2" fill="none" />
                                  <circle cx="16" cy="6" r="3.5" fill={preset.leafColor} />
                                  <circle cx="18" cy="9" r="2.5" fill={preset.leafColor} />
                                </>
                              )}
                              {key === "forest" && (
                                <>
                                  {/* Creative Forest Icon */}
                                  <rect x="7" y="15" width="2.5" height="9" rx="1" fill="#795548" />
                                  <ellipse cx="8.25" cy="14" rx="4.5" ry="3.5" fill={preset.leafColor} />

                                  <rect x="13.5" y="12" width="3" height="12" rx="1.5" fill="#795548" />
                                  <ellipse cx="15" cy="11" rx="5.5" ry="4" fill={preset.leafColor} />

                                  <rect x="21" y="17" width="2" height="7" rx="1" fill="#795548" />
                                  <ellipse cx="22" cy="16" rx="4" ry="3" fill={preset.leafColor} />
                                </>
                              )}
                            </svg>
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white capitalize">{key}</div>
                            <div className="text-xs text-forest-200 mt-1">
                              {key === "formal" && "Straight trunk with symmetrical branches"}
                              {key === "slanting" && "Trunk grows at an angle, shaped by winds"}
                              {key === "cascade" && "Branches grow downward like cliff trees"}
                              {key === "literati" && "Slender trunk with minimal branches"}
                              {key === "forest" && "Multiple trees creating a forest scene"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Background decorative elements */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-forest-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 bg-forest-600/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="controls" className="space-y-4 mt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-forest-100">
                  <GitBranch size={16} className="text-forest-300" />
                  Tree Structure
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-forest-100">Trunk Thickness</label>
                      <span className="text-sm text-forest-300">{params.trunkThickness}</span>
                    </div>
                    <Slider
                      value={[params.trunkThickness]}
                      min={5}
                      max={20}
                      step={1}
                      onValueChange={(value) => updateParam("trunkThickness", value[0])}
                      className="py-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-forest-100">Branch Density</label>
                      <span className="text-sm text-forest-300">{params.branchDensity}%</span>
                    </div>
                    <Slider
                      value={[params.branchDensity]}
                      min={10}
                      max={100}
                      step={5}
                      onValueChange={(value) => updateParam("branchDensity", value[0])}
                      className="py-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-forest-100">Tree Height</label>
                      <span className="text-sm text-forest-300">{params.treeHeight}%</span>
                    </div>
                    <Slider
                      value={[params.treeHeight]}
                      min={30}
                      max={100}
                      step={5}
                      onValueChange={(value) => updateParam("treeHeight", value[0])}
                      className="py-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-forest-100">Branch Angle Variation</label>
                      <span className="text-sm text-forest-300">{params.branchAngleVariation}°</span>
                    </div>
                    <Slider
                      value={[params.branchAngleVariation]}
                      min={10}
                      max={80}
                      step={5}
                      onValueChange={(value) => updateParam("branchAngleVariation", value[0])}
                      className="py-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-forest-100">Tree Age</label>
                      <span className="text-sm text-forest-300">{params.treeAge}%</span>
                    </div>
                    <Slider
                      value={[params.treeAge]}
                      min={20}
                      max={100}
                      step={5}
                      onValueChange={(value) => updateParam("treeAge", value[0])}
                      className="py-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-forest-100">Wind Effect</label>
                      <span className="text-sm text-forest-300">{params.windEffect}%</span>
                    </div>
                    <Slider
                      value={[params.windEffect]}
                      min={0}
                      max={40}
                      step={5}
                      onValueChange={(value) => updateParam("windEffect", value[0])}
                      className="py-1"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-forest-100">
                  <Leaf size={16} className="text-forest-300" />
                  Foliage
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium block mb-2 text-forest-100">Leaf Color</label>
                    <div className="grid grid-cols-4 gap-2">
                      {LEAF_COLORS.map((color) => (
                        <button
                          key={color.value}
                          className={cn(
                            "w-full aspect-square rounded-full border-2 transition-all",
                            params.leafColor === color.value
                              ? "border-white scale-110 shadow-lg"
                              : "border-transparent hover:scale-105",
                          )}
                          style={{ backgroundColor: color.value }}
                          onClick={() => updateParam("leafColor", color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-forest-100">Leaf Density</label>
                      <span className="text-sm text-forest-300">{params.leafDensity}%</span>
                    </div>
                    <Slider
                      value={[params.leafDensity]}
                      min={10}
                      max={100}
                      step={5}
                      onValueChange={(value) => updateParam("leafDensity", value[0])}
                      className="py-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
