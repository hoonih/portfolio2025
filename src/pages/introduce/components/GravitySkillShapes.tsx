import { useEffect, useRef } from "react";
import Matter from "matter-js";
import type { ShapeKind, Skill } from "../../../data/profile.ts";

const { Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint, Query, Render, Runner } = Matter;

// Matter.Mouse가 캔버스에 직접 붙이는 리스너들 — 공개 타입에는 없어서 보강
type MouseListeners = Record<"mousedown" | "mousemove" | "mouseup" | "mousewheel", (event: Event) => void>;

interface Props {
    skills: Skill[];
    width: number;
    height: number;
}

const FILL_RATIO = 0.6; // 상자 넓이 중 도형이 차지할 비율 — 쌓였을 때 화면이 꽉 차 보이는 정도
const MIN_FONT = 9;
const LINE_HEIGHT = 1.15;
const FONT = (size: number) => `600 ${size}px Pretendard, sans-serif`;
const STAR_OUTER = 1.35;
const STAR_INNER = 0.6;

// 모든 수치는 크기 s = 1 기준
// area: 넓이 (전체 크기 계산용) / span: 가장 긴 폭 (상자를 넘지 않게)
// textWidth, textHeight: 글자가 들어갈 영역 / textY: 글자 중심을 아래로 내리는 정도 (삼각형처럼 무게중심이 위에 있는 도형)
interface ShapeSpec {
    area: number;
    span: number;
    textWidth: number;
    textHeight: number;
    textY?: number;
    create: (s: number) => Matter.Body;
}

const starOutline = (s: number) =>
    Array.from({ length: 10 }, (_, i) => {
        const r = (i % 2 === 0 ? STAR_OUTER : STAR_INNER) * s;
        const angle = -Math.PI / 2 + (i * Math.PI) / 5;
        return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
    });

// 별은 오목 다각형이라 그대로는 충돌 판정이 안 됨 → 가운데 오각형 + 꼭짓점 삼각형 5개를 묶은 복합 바디
const createStar = (s: number) => {
    const points = starOutline(s);
    const inner = points.filter((_, i) => i % 2 === 1);
    const centroid = (vs: Matter.Vector[]) => ({
        x: vs.reduce((sum, v) => sum + v.x, 0) / vs.length,
        y: vs.reduce((sum, v) => sum + v.y, 0) / vs.length,
    });
    const piece = (vs: Matter.Vector[]) => {
        const c = centroid(vs);
        return Bodies.fromVertices(c.x, c.y, [vs]);
    };
    const tips = points
        .map((p, i) => (i % 2 === 0 ? piece([points[(i + 9) % 10], p, points[i + 1]]) : null))
        .filter((b): b is Matter.Body => b !== null);
    return Body.create({ parts: [piece(inner), ...tips] });
};

const SHAPES: Record<ShapeKind, ShapeSpec> = {
    circle: { area: Math.PI, span: 2, textWidth: 1.6, textHeight: 1.2, create: s => Bodies.circle(0, 0, s) },
    square: {
        area: 2.89, span: 1.7, textWidth: 1.4, textHeight: 1.3,
        create: s => Bodies.rectangle(0, 0, 1.7 * s, 1.7 * s, { chamfer: { radius: 0.2 * s } }),
    },
    rect: {
        area: 3.38, span: 2.6, textWidth: 2.3, textHeight: 1.0,
        create: s => Bodies.rectangle(0, 0, 2.6 * s, 1.3 * s, { chamfer: { radius: 0.15 * s } }),
    },
    pill: {
        area: 2.94, span: 2.8, textWidth: 2.2, textHeight: 0.85,
        create: s => Bodies.rectangle(0, 0, 2.8 * s, 1.15 * s, { chamfer: { radius: 0.575 * s } }),
    },
    triangle: {
        area: 2.03, span: 2.17, textWidth: 1.1, textHeight: 0.7, textY: 0.15,
        create: s => {
            const body = Bodies.polygon(0, 0, 3, 1.25 * s, { chamfer: { radius: 0.12 * s } });
            Body.setAngle(body, Math.PI / 2); // 밑변이 아래로 오게
            return body;
        },
    },
    hexagon: { area: 3.14, span: 2.2, textWidth: 1.6, textHeight: 1.3, create: s => Bodies.polygon(0, 0, 6, 1.1 * s) },
    star: { area: 2.38, span: 2.7, textWidth: 0.95, textHeight: 0.75, create: createStar },
};

// 긴 이름은 가로로 넓은 도형, 짧은 이름은 별·삼각형 같은 좁은 도형에 배정
// 여러 줄로 나뉠 수 있으므로 가장 긴 단어 기준
const WIDE_SHAPES: ShapeKind[] = ["pill", "rect", "circle", "hexagon"];
const COMPACT_SHAPES: ShapeKind[] = ["star", "triangle", "square", "circle", "hexagon"];

const assignShapes = (skills: Skill[]) => {
    let wide = 0;
    let compact = 0;
    return skills.map(skill => {
        if (skill.shape) return skill.shape;
        const longestWord = Math.max(...skill.name.split(" ").map(word => word.length));
        return longestWord > 6
            ? WIDE_SHAPES[wide++ % WIDE_SHAPES.length]
            : COMPACT_SHAPES[compact++ % COMPACT_SHAPES.length];
    });
};

// 한 줄 / 단어마다 줄바꿈 중 글자를 더 크게 쓸 수 있는 쪽을 고름
const layoutLabel = (ctx: CanvasRenderingContext2D, label: string, spec: ShapeSpec, size: number) => {
    ctx.font = FONT(100);
    const fontFor = (lines: string[]) => Math.min(
        0.42 * size,
        (spec.textWidth * size * 100) / Math.max(...lines.map(line => ctx.measureText(line).width)),
        (spec.textHeight * size) / (lines.length * LINE_HEIGHT),
    );
    const candidates = [[label], label.split(" ")];
    const lines = candidates.reduce((best, next) => (fontFor(next) > fontFor(best) ? next : best));
    return { lines, fontSize: Math.max(MIN_FONT, fontFor(lines)) };
};

const shuffle = <T,>(items: T[]) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

interface Item {
    body: Matter.Body;
    kind: ShapeKind;
    size: number;
    lines: string[];
    fontSize: number;
    outlined: boolean;
    baseAngle: number; // 생성 시 돌려 둔 각도 — 글자는 이만큼 빼고 회전
}

const GravitySkillShapes = ({ skills, width, height }: Props) => {
    const sceneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const engine = Engine.create();
        engine.positionIterations = 8; // 크게 쌓여도 겹치지 않도록

        // 고해상도 화면에서 선명하게. Matter.Mouse가 배율을 정수로 읽어서 반올림
        const pixelRatio = Math.max(1, Math.round(window.devicePixelRatio || 1));
        const render = Render.create({
            element: sceneRef.current!,
            engine,
            options: { width, height, pixelRatio, wireframes: false, background: "transparent" },
        });
        const ctx = render.context;

        // 상자 넓이에 맞춰 전체 크기를 정함. 단, 가장 큰 도형이 상자 폭을 넘지 않게
        const kinds = assignShapes(skills);
        const units = skills.map(skill => 10 + skill.level);
        const totalArea = units.reduce((sum, u, i) => sum + SHAPES[kinds[i]].area * u * u, 0);
        const scale = Math.min(
            Math.sqrt((FILL_RATIO * width * height) / totalArea),
            ...units.map((u, i) => (0.85 * width) / (SHAPES[kinds[i]].span * u)),
            ...units.map((u, i) => (0.6 * height) / (SHAPES[kinds[i]].span * u)),
        );

        const items: Item[] = skills.map((skill, i) => {
            const kind = kinds[i];
            const spec = SHAPES[kind];
            const size = units[i] * scale;
            const body = spec.create(size);
            Body.set(body, { restitution: 0.5, friction: 0.3 });
            Body.setDensity(body, 0.001);
            body.render.visible = false; // 기본 렌더러 대신 afterRender에서 직접 그림

            const { lines, fontSize } = layoutLabel(ctx, skill.name, spec, size);

            return { body, kind, size, lines, fontSize, outlined: i % 3 === 2, baseAngle: body.angle };
        });

        // 상자 위쪽 바깥에 줄지어 배치해 두고 떨어뜨림 — 처음부터 겹쳐서 튕겨 나가는 일이 없음
        const gap = 8;
        let x = gap;
        let rowTop = 0;
        let rowHeight = 0;
        const placed = shuffle(items).map(({ body }) => {
            const w = body.bounds.max.x - body.bounds.min.x;
            const h = body.bounds.max.y - body.bounds.min.y;
            if (x + w > width - gap && x > gap) {
                x = gap;
                rowTop += rowHeight + gap;
                rowHeight = 0;
            }
            const position = { x: x + w / 2 + Math.random() * gap, y: rowTop + h / 2 };
            x += w + gap;
            rowHeight = Math.max(rowHeight, h);
            return { body, position };
        });
        const stackHeight = rowTop + rowHeight;
        placed.forEach(({ body, position }) => {
            Body.setPosition(body, { x: position.x, y: position.y - stackHeight - gap });
            Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
        });

        // 바닥과 양옆 벽. 위는 열어 두고 벽을 높게 세워서, 던져 올려도 다시 떨어짐
        const thick = 100;
        const wallHeight = height + stackHeight + height * 4;
        const wallCenterY = height - wallHeight / 2;
        const walls = [
            Bodies.rectangle(width / 2, height + thick / 2, width + thick * 2, thick, { isStatic: true }),
            Bodies.rectangle(-thick / 2, wallCenterY, thick, wallHeight, { isStatic: true }),
            Bodies.rectangle(width + thick / 2, wallCenterY, thick, wallHeight, { isStatic: true }),
        ];
        walls.forEach(wall => { wall.render.visible = false; });

        const bodies = items.map(item => item.body);
        Composite.add(engine.world, [...walls, ...bodies]);

        // 드래그 (연결선 숨김)
        const mouse = Mouse.create(render.canvas) as Matter.Mouse & MouseListeners;
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.15, render: { visible: false } },
        });
        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // Matter.js 기본 리스너는 휠/터치 스크롤을 막으므로 교체
        // 휠은 페이지 스크롤에 맡기고, 터치는 도형을 잡았을 때만 드래그로 처리
        const canvas = render.canvas;
        canvas.removeEventListener("wheel", mouse.mousewheel);
        canvas.removeEventListener("touchstart", mouse.mousedown);
        canvas.removeEventListener("touchmove", mouse.mousemove);
        canvas.removeEventListener("touchend", mouse.mouseup);

        let touchDragging = false;
        const onTouchStart = (event: TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const touch = event.changedTouches[0];
            const point = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
            touchDragging = Query.point(bodies, point).length > 0;
            if (touchDragging) mouse.mousedown(event);
        };
        const onTouchMove = (event: TouchEvent) => {
            if (touchDragging) mouse.mousemove(event);
        };
        const onTouchEnd = (event: TouchEvent) => {
            if (!touchDragging) return;
            mouse.mouseup(event);
            touchDragging = false;
        };
        canvas.addEventListener("touchstart", onTouchStart, { passive: false });
        canvas.addEventListener("touchmove", onTouchMove, { passive: false });
        canvas.addEventListener("touchend", onTouchEnd, { passive: false });

        // 도형 + 글자 그리기
        const traceShape = ({ body, kind, size }: Item) => {
            ctx.beginPath();
            if (kind === "circle") {
                ctx.arc(body.position.x, body.position.y, size, 0, Math.PI * 2);
            } else {
                // 별은 복합 바디라 body.vertices가 외곽선이 아님 → 원래 별 모양을 회전시켜 그림
                const cos = Math.cos(body.angle);
                const sin = Math.sin(body.angle);
                const outline = kind === "star"
                    ? starOutline(size).map(p => ({
                        x: body.position.x + p.x * cos - p.y * sin,
                        y: body.position.y + p.x * sin + p.y * cos,
                    }))
                    : body.vertices;
                outline.forEach((v, i) => (i === 0 ? ctx.moveTo(v.x, v.y) : ctx.lineTo(v.x, v.y)));
            }
            ctx.closePath();
        };

        Events.on(render, "afterRender", () => {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineJoin = "round";

            items.forEach(item => {
                traceShape(item);
                if (item.outlined) {
                    ctx.fillStyle = "#0A0A0A";
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "#FFF";
                    ctx.stroke();
                } else {
                    ctx.fillStyle = "#FFF";
                    ctx.fill();
                }

                ctx.save();
                ctx.translate(item.body.position.x, item.body.position.y);
                ctx.rotate(item.body.angle - item.baseAngle);
                ctx.fillStyle = item.outlined ? "#FFF" : "#0A0A0A";
                ctx.font = FONT(item.fontSize);
                const lineGap = item.fontSize * LINE_HEIGHT;
                const top = (SHAPES[item.kind].textY ?? 0) * item.size - ((item.lines.length - 1) * lineGap) / 2;
                item.lines.forEach((line, i) => ctx.fillText(line, 0, top + i * lineGap));
                ctx.restore();
            });
        });

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        return () => {
            canvas.removeEventListener("touchstart", onTouchStart);
            canvas.removeEventListener("touchmove", onTouchMove);
            canvas.removeEventListener("touchend", onTouchEnd);
            Runner.stop(runner);
            Render.stop(render);
            Composite.clear(engine.world, false);
            Engine.clear(engine);
            render.canvas.remove();
        };
    }, [skills, width, height]);

    return <div ref={sceneRef} />;
};

export default GravitySkillShapes;
