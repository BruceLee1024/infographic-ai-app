import type { InfographicOptions } from '@antv/infographic';
import {
  loadSVGResource,
  registerResourceLoader,
  Infographic as Renderer,
} from '@antv/infographic';
import { useEffect, useRef } from 'react';

// 资源缓存
const svgTextCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string | null>>();

// 常用 unDraw 插图名称映射（AI 可能生成的名称 -> 实际文件名）
const ILLUS_NAME_MAP: Record<string, string> = {
  // 科技类
  'coding': 'programming',
  'code': 'programming',
  'developer': 'programming',
  'programming': 'programming',
  'server': 'server-cluster',
  'servers': 'server-cluster',
  'server-cluster': 'server-cluster',
  'cloud': 'cloud-hosting',
  'cloud-hosting': 'cloud-hosting',
  'ai': 'artificial-intelligence',
  'artificial-intelligence': 'artificial-intelligence',
  'robot': 'artificial-intelligence',
  'machine-learning': 'artificial-intelligence',
  'data': 'data-report',
  'data-report': 'data-report',
  'analytics': 'analytics',
  'analysis': 'analytics',
  'website': 'website-builder',
  'web': 'static-website',
  'mobile': 'mobile-development',
  'app': 'mobile-development',
  'security': 'security-on',
  'secure': 'security-on',
  
  // 商务类
  'business': 'business-plan',
  'business-plan': 'business-plan',
  'plan': 'business-plan',
  'strategy': 'business-plan',
  'meeting': 'meeting',
  'team': 'team-spirit',
  'team-work': 'team-spirit',
  'teamwork': 'team-spirit',
  'collaboration': 'collaboration',
  'presentation': 'presentation',
  'present': 'presentation',
  'agreement': 'agreement',
  'contract': 'agreement',
  'deal': 'agreement',
  'growth': 'growth-analytics',
  'chart': 'growth-analytics',
  'finance': 'finance',
  'money': 'finance',
  'investment': 'invest',
  'invest': 'invest',
  
  // 设计类
  'design': 'design-thinking',
  'design-thinking': 'design-thinking',
  'wireframe': 'wireframing',
  'wireframing': 'wireframing',
  'prototype': 'prototyping-process',
  'prototyping': 'prototyping-process',
  'creative': 'creative-thinking',
  'creativity': 'creative-thinking',
  'idea': 'lightbulb-moment',
  'ideas': 'lightbulb-moment',
  'brainstorm': 'brainstorming',
  
  // 流程类
  'process': 'process',
  'workflow': 'process',
  'progress': 'in-progress',
  'in-progress': 'in-progress',
  'done': 'completed',
  'complete': 'completed',
  'completed': 'completed',
  'success': 'completed',
  'launch': 'launching',
  'launching': 'launching',
  'rocket': 'launching',
  'start': 'getting-started',
  'begin': 'getting-started',
  
  // 人物类
  'person': 'personal-info',
  'user': 'personal-info',
  'profile': 'personal-info',
  'happy': 'happy-feeling',
  'celebration': 'celebration',
  'winner': 'winners',
  'achievement': 'winners',
  
  // 通信类
  'email': 'mail-sent',
  'mail': 'mail-sent',
  'message': 'messaging',
  'chat': 'messaging',
  'communication': 'messaging',
  'social': 'social-networking',
  'network': 'social-networking',
  
  // 教育类
  'education': 'education',
  'learning': 'online-learning',
  'study': 'studying',
  'book': 'bibliophile',
  'knowledge': 'knowledge',
  
  // 其他常用
  'search': 'searching',
  'searching': 'searching',
  'find': 'searching',
  'settings': 'preferences',
  'config': 'preferences',
  'time': 'time-management',
  'schedule': 'schedule',
  'calendar': 'schedule',
  'goal': 'goals',
  'target': 'goals',
  'goals': 'goals',
};

// 模糊匹配插图名称
function fuzzyMatchIllus(name: string): string {
  // 1. 先尝试直接映射
  const normalized = name.toLowerCase().replace(/_/g, '-');
  if (ILLUS_NAME_MAP[normalized]) {
    return ILLUS_NAME_MAP[normalized];
  }
  
  // 2. 尝试部分匹配
  for (const [key, value] of Object.entries(ILLUS_NAME_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  // 3. 返回原始名称（转换下划线为连字符）
  return normalized;
}

// 注册资源加载器 - 使用 Iconify API
registerResourceLoader(async (config) => {
  const { data, scene } = config;

  try {
    const key = `${scene}::${data}`;
    let svgText: string | null;

    // 1. 命中缓存
    if (svgTextCache.has(key)) {
      svgText = svgTextCache.get(key)!;
    }
    // 2. 已有请求在进行中
    else if (pendingRequests.has(key)) {
      svgText = await pendingRequests.get(key)!;
    }
    // 3. 发起新请求
    else {
      const fetchPromise = (async () => {
        try {
          let url: string | null = null;

          if (scene === 'icon') {
            // Iconify API
            url = `https://api.iconify.design/${data}.svg`;
          } else if (scene === 'illus') {
            // unDraw GitHub 镜像 - 使用模糊匹配
            const matchedName = fuzzyMatchIllus(data);
            url = `https://raw.githubusercontent.com/balazser/undraw-svg-collection/refs/heads/main/svgs/${matchedName}.svg`;
            
            // 如果匹配后的名称不同，也缓存原始名称
            if (matchedName !== data) {
              const matchedKey = `${scene}::${matchedName}`;
              if (svgTextCache.has(matchedKey)) {
                return svgTextCache.get(matchedKey)!;
              }
            }
          }

          if (!url) return null;

          const response = await fetch(url);

          if (!response.ok) {
            // 如果是插图且失败，尝试一些备选名称
            if (scene === 'illus') {
              const fallbacks = ['programming', 'business-plan', 'team-spirit', 'analytics', 'process'];
              for (const fallback of fallbacks) {
                const fallbackUrl = `https://raw.githubusercontent.com/balazser/undraw-svg-collection/refs/heads/main/svgs/${fallback}.svg`;
                const fallbackResponse = await fetch(fallbackUrl);
                if (fallbackResponse.ok) {
                  const text = await fallbackResponse.text();
                  if (text && text.trim().startsWith('<svg')) {
                    console.info(`Fallback illus "${fallback}" used for "${data}"`);
                    svgTextCache.set(key, text);
                    return text;
                  }
                }
              }
            }
            console.warn(`HTTP ${response.status}: Failed to load ${url}`);
            return null;
          }

          const text = await response.text();

          if (!text || !text.trim().startsWith('<svg')) {
            console.warn(`Invalid SVG content from ${url}`);
            return null;
          }

          svgTextCache.set(key, text);
          return text;
        } catch (fetchError) {
          console.warn(`Failed to fetch resource ${key}:`, fetchError);
          return null;
        }
      })();

      pendingRequests.set(key, fetchPromise);

      try {
        svgText = await fetchPromise;
      } catch (error) {
        pendingRequests.delete(key);
        console.warn(`Error loading resource ${key}:`, error);
        return null;
      } finally {
        pendingRequests.delete(key);
      }
    }

    if (!svgText) {
      return null;
    }

    const resource = loadSVGResource(svgText);

    if (!resource) {
      console.warn(`loadSVGResource returned null for ${key}`);
      svgTextCache.delete(key);
      return null;
    }

    return resource;
  } catch (error) {
    console.warn('Unexpected error in resource loader:', error);
    return null;
  }
});

export const Infographic = ({
  options,
  init,
  onError,
}: {
  options: string | InfographicOptions;
  init?: Partial<InfographicOptions>;
  onError?: (error: Error | null) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Renderer | null>(null);
  const renderTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (instanceRef.current) return;

    const instance = new Renderer({
      container: containerRef.current,
      editable: true, // 默认启用可编辑功能
      svg: {
        attributes: {
          width: '100%',
          height: '100%',
        },
        style: {
          maxHeight: '80vh',
        },
      },
      ...init,
    });
    instanceRef.current = instance;
    Object.assign(window, { infographic: instance });

    return () => {
      if (renderTimerRef.current) {
        clearTimeout(renderTimerRef.current);
      }
      instance.destroy();
      instanceRef.current = null;
    };
  }, [init]);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance || !options) return;

    // 清除之前的定时器
    if (renderTimerRef.current) {
      clearTimeout(renderTimerRef.current);
    }

    // 使用防抖，减少渲染频率
    renderTimerRef.current = setTimeout(() => {
      try {
        onError?.(null);
        instance.render(options);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('Dev Infographic render error', error);
        onError?.(error);
      }
    }, 100); // 100ms 防抖延迟

    return () => {
      if (renderTimerRef.current) {
        clearTimeout(renderTimerRef.current);
      }
    };
  }, [options, onError]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};
