/**
 * AI 智能优化建议服务
 */

export interface OptimizationSuggestion {
  id: string;
  type: 'color' | 'layout' | 'content' | 'typography' | 'general';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: {
    type: 'apply-palette' | 'apply-template' | 'apply-text' | 'custom';
    data: any;
  };
}

export interface OptimizationResult {
  score: number; // 0-100
  suggestions: OptimizationSuggestion[];
  summary: string;
}

/**
 * 分析信息图并生成优化建议
 */
export async function analyzeInfographic(
  dsl: string,
  apiKey: string
): Promise<OptimizationResult> {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是一位专业的信息图设计顾问。请分析用户的信息图 DSL，从以下方面提供优化建议：

1. **配色方案**：评估颜色搭配是否和谐、对比度是否合适、是否符合主题
2. **模板选择**：评估当前模板是否最适合展示内容，是否有更好的模板
3. **内容文案**：评估文字是否简洁、重点是否突出、表达是否清晰
4. **整体设计**：评估视觉层级、信息密度等

**重要：只提供以下两种可自动应用的建议：**
- **配色优化**：action.type 必须是 "apply-palette"，data 是空格分隔的颜色值（如 "#FF6B35 #F7931E #FDC830"）
- **模板切换**：action.type 必须是 "apply-template"，data 是模板名称（如 "sequence-timeline-simple"）

其他建议（如布局调整、内容修改等）不要添加 action 字段，仅作为参考建议。

请以 JSON 格式返回分析结果，格式如下：
{
  "score": 85,
  "summary": "整体设计良好，但配色可以更加鲜明",
  "suggestions": [
    {
      "id": "1",
      "type": "color",
      "title": "建议使用更高对比度的配色",
      "description": "当前配色对比度较低，建议使用更鲜明的颜色组合以提升视觉冲击力",
      "priority": "high",
      "action": {
        "type": "apply-palette",
        "data": "#FF6B35 #F7931E #FDC830 #37B7C3 #088395"
      }
    },
    {
      "id": "2",
      "type": "layout",
      "title": "考虑使用时间轴模板",
      "description": "当前内容更适合用时间轴展示，可以更好地体现时间顺序",
      "priority": "medium",
      "action": {
        "type": "apply-template",
        "data": "sequence-timeline-simple"
      }
    },
    {
      "id": "3",
      "type": "content",
      "title": "简化描述文字",
      "description": "部分描述过长，建议精简到15字以内",
      "priority": "low"
    }
  ]
}

注意：
- 配色建议的 data 必须是空格分隔的颜色值，不要用逗号
- 模板建议的 data 必须是有效的模板名称
- 无法自动应用的建议不要加 action 字段`,
          },
          {
            role: 'user',
            content: `请分析以下信息图 DSL 并提供优化建议：\n\n${dsl}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('AI 分析失败');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // 提取 JSON
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('无法解析 AI 响应');
    }

    const result = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('AI 优化分析失败:', error);
    throw error;
  }
}

/**
 * 获取快速优化建议（不调用 AI，基于规则）
 */
export function getQuickSuggestions(dsl: string): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];

  // 检查配色
  if (!dsl.includes('theme') && !dsl.includes('palette')) {
    suggestions.push({
      id: 'quick-1',
      type: 'color',
      title: '添加主题配色',
      description: '当前未设置主题配色，建议添加配色方案以提升视觉效果',
      priority: 'high',
      action: {
        type: 'apply-palette',
        data: '#FF6B35 #F7931E #FDC830 #37B7C3 #088395',
      },
    });
  }

  // 检查内容长度
  const lines = dsl.split('\n');
  const longLines = lines.filter((line) => line.length > 100);
  if (longLines.length > 0) {
    suggestions.push({
      id: 'quick-2',
      type: 'content',
      title: '简化文字内容',
      description: '部分文字过长，建议精简内容以提升可读性',
      priority: 'medium',
    });
  }

  // 检查数据项数量
  const itemsMatch = dsl.match(/- label/g);
  const itemCount = itemsMatch ? itemsMatch.length : 0;
  if (itemCount > 8) {
    suggestions.push({
      id: 'quick-3',
      type: 'layout',
      title: '考虑分组展示',
      description: `当前有 ${itemCount} 个数据项，建议分组或分页展示以避免信息过载`,
      priority: 'medium',
    });
  }

  // 检查图标使用
  if (!dsl.includes('icon')) {
    suggestions.push({
      id: 'quick-4',
      type: 'general',
      title: '添加图标增强视觉效果',
      description: '建议为关键信息添加图标，提升视觉吸引力和信息传达效率',
      priority: 'low',
    });
  }

  return suggestions;
}

/**
 * 应用优化建议
 */
export function applySuggestion(
  dsl: string,
  suggestion: OptimizationSuggestion
): string {
  if (!suggestion.action) return dsl;

  switch (suggestion.action.type) {
    case 'apply-palette': {
      const palette = suggestion.action.data;
      
      // 检查是否是 JSON 格式
      let isJson = false;
      let jsonObj: any = null;
      try {
        jsonObj = JSON.parse(dsl);
        if (jsonObj && typeof jsonObj === 'object' && jsonObj.design) {
          isJson = true;
        }
      } catch (e) {
        // 不是 JSON，是 DSL 格式
      }

      if (isJson && jsonObj) {
        // JSON 格式：直接修改 themeConfig
        if (!jsonObj.themeConfig) {
          jsonObj.themeConfig = {};
        }
        jsonObj.themeConfig.palette = palette.split(/\s+/);
        return JSON.stringify(jsonObj, null, 2);
      } else {
        // DSL 格式：移除现有的 theme 块并添加新的
        const lines = dsl.split('\n');
        const filteredLines: string[] = [];
        let inThemeBlock = false;
        
        for (const line of lines) {
          if (line.match(/^theme(\s|$)/)) {
            inThemeBlock = true;
            continue;
          }
          if (inThemeBlock && line.match(/^  /)) {
            continue;
          }
          inThemeBlock = false;
          filteredLines.push(line);
        }
        
        // 添加新的配色
        let newDsl = filteredLines.join('\n').trim();
        newDsl += `\ntheme\n  palette ${palette}`;
        return newDsl;
      }
    }

    case 'apply-template': {
      const template = suggestion.action.data;
      const lines = dsl.split('\n');
      if (lines[0] && lines[0].startsWith('infographic ')) {
        lines[0] = `infographic ${template}`;
      }
      return lines.join('\n');
    }

    default:
      return dsl;
  }
}
