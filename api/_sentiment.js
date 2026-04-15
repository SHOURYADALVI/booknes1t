// ── Sentiment Analysis & Business Issue Detection ─────────────────────────────
// Analyzes review text to identify sentiment and business problems requiring attention

/**
 * Sentiment keywords and their mapped business areas
 */
const SENTIMENT_KEYWORDS = {
  // POSITIVE
  positive: {
    delivery: ["fast delivery", "quick delivery", "arrived early", "on time", "excellent packaging", "well packed", "arrived in perfect condition"],
    product: ["great quality", "excellent quality", "durable", "well-written", "engaging", "captivating", "page-turner", "worth it", "amazing", "beautiful"],
    service: ["good customer service", "responsive", "helpful support", "quick response"],
    value: ["great value", "affordable", "worth the money", "excellent price", "good deal"],
  },
  
  // NEGATIVE/WARNING
  negative: {
    delivery: ["late delivery", "delayed", "took too long", "slow shipping", "damaged in shipping", "broken package", "poor packaging", "damaged upon arrival"],
    product: ["poor quality", "low quality", "disappointing", "overpriced", "not worth", "cheap paper", "ink fades", "pages fell off", "torn pages", "misprinted"],
    service: ["bad customer service", "rude staff", "no support", "ignored complaint", "unhelpful", "slow response"],
    value: ["overpriced", "too expensive", "not worth the price", "wasted money"],
  },
};

/**
 * Analyze sentiment from review text and rating
 * Returns: { sentiment: 'positive'|'neutral'|'negative', issues: [], keywords: [] }
 */
function analyzeSentiment(reviewText, rating) {
  const text = reviewText.toLowerCase();
  let issues = [];
  let keywords = [];
  let sentiment = "neutral";

  // Check for negative indicators
  const negativeMatches = [];
  Object.entries(SENTIMENT_KEYWORDS.negative).forEach(([area, words]) => {
    words.forEach(word => {
      if (text.includes(word)) {
        negativeMatches.push({ area, keyword: word });
        if (!keywords.includes(word)) keywords.push(word);
      }
    });
  });

  // Check for positive indicators
  const positiveMatches = [];
  Object.entries(SENTIMENT_KEYWORDS.positive).forEach(([area, words]) => {
    words.forEach(word => {
      if (text.includes(word)) {
        positiveMatches.push({ area, keyword: word });
        if (!keywords.includes(word)) keywords.push(word);
      }
    });
  });

  // Determine sentiment
  if (rating <= 2) {
    sentiment = "negative";
    // Collect unique areas from negative matches
    const areas = [...new Set(negativeMatches.map(m => m.area))];
    issues = areas.map(area => ({
      area,
      severity: "high",
      keywords: negativeMatches.filter(m => m.area === area).map(m => m.keyword),
    }));
  } else if (rating === 3) {
    sentiment = "neutral";
    const areas = [...new Set([...negativeMatches.map(m => m.area), ...positiveMatches.map(m => m.area)])];
    issues = areas.map(area => ({
      area,
      severity: negativeMatches.some(m => m.area === area) ? "medium" : "low",
      keywords: [...negativeMatches.filter(m => m.area === area), ...positiveMatches.filter(m => m.area === area)].map(m => m.keyword),
    }));
  } else {
    sentiment = "positive";
    // Only include positive issues if there are minor negatives mentioned
    if (negativeMatches.length > 0) {
      const areas = [...new Set(negativeMatches.map(m => m.area))];
      issues = areas.map(area => ({
        area,
        severity: "low",
        keywords: negativeMatches.filter(m => m.area === area).map(m => m.keyword),
      }));
    }
  }

  return {
    sentiment,
    issues,
    keywords,
    rating,
  };
}

/**
 * Generate business health report from reviews
 * Shows which areas need immediate attention
 */
function generateBusinessHealthReport(reviewsData) {
  const areaMetrics = {
    delivery: { total: 0, negative: 0, neutral: 0, positive: 0, issues: [] },
    product: { total: 0, negative: 0, neutral: 0, positive: 0, issues: [] },
    service: { total: 0, negative: 0, neutral: 0, positive: 0, issues: [] },
    value: { total: 0, negative: 0, neutral: 0, positive: 0, issues: [] },
  };

  const reviewInsights = [];

  reviewsData.forEach(review => {
    const analysis = analyzeSentiment(review.text, review.rating);
    reviewInsights.push({
      reviewId: review.id,
      sentiment: analysis.sentiment,
      issues: analysis.issues,
      rating: review.rating,
    });

    // Collect area data
    analysis.issues.forEach(issue => {
      if (areaMetrics[issue.area]) {
        areaMetrics[issue.area].total += 1;
        areaMetrics[issue.area][analysis.sentiment] += 1;
        areaMetrics[issue.area].issues.push({
          severity: issue.severity,
          keywords: issue.keywords,
          reviewId: review.id,
        });
      }
    });
  });

  // Calculate health scores (0-100, higher is better)
  const areaHealthScores = {};
  const priorityAreas = [];
  const areaDetails = {}; // Detailed problem breakdown

  Object.entries(areaMetrics).forEach(([area, metrics]) => {
    if (metrics.total === 0) {
      areaHealthScores[area] = 100; // No issues = perfect health
      return;
    }

    const negativeRatio = metrics.negative / metrics.total;
    const neutralRatio = metrics.neutral / metrics.total;
    const healthScore = Math.round((1 - negativeRatio * 0.5 - neutralRatio * 0.2) * 100);

    areaHealthScores[area] = Math.max(0, healthScore);

    // Collect problem details for breakdown
    const problemMap = {};
    metrics.issues.forEach(issue => {
      issue.keywords.forEach(kw => {
        if (!problemMap[kw]) {
          problemMap[kw] = { keyword: kw, count: 0, severity: issue.severity };
        }
        problemMap[kw].count += 1;
      });
    });

    areaDetails[area] = {
      problems: Object.values(problemMap).sort((a, b) => b.count - a.count),
      totalIssues: metrics.negative,
      healthScore,
    };

    // Priority areas (needs attention)
    if (healthScore < 70) {
      priorityAreas.push({
        area,
        healthScore,
        issueCount: metrics.negative,
        attention: healthScore < 50 ? "critical" : "high",
        topKeywords: [...new Set(
          metrics.issues.filter(i => i.severity !== "low").flatMap(i => i.keywords)
        )].slice(0, 3),
      });
    }
  });

  // Extract negative reviews with full details
  const negativeReviews = reviewsData
    .map((review, idx) => {
      const insight = reviewInsights[idx];
      return { ...review, sentiment: insight.sentiment, issues: insight.issues };
    })
    .filter(r => r.sentiment === "negative")
    .sort((a, b) => b.rating - a.rating); // Sort by rating (highest first)

  return {
    areaHealthScores,
    priorityAreas: priorityAreas.sort((a, b) => a.healthScore - b.healthScore),
    areaDetails,
    totalReviewsAnalyzed: reviewsData.length,
    negativeReviewCount: reviewInsights.filter(r => r.sentiment === "negative").length,
    neutralReviewCount: reviewInsights.filter(r => r.sentiment === "neutral").length,
    positiveReviewCount: reviewInsights.filter(r => r.sentiment === "positive").length,
    negativeReviews, // All negative reviews with full details
  };
}

/**
 * Generate deep, actionable insights based on area and specific issues
 */
function getActionableInsights(healthReport) {
  const insights = [];

  healthReport.priorityAreas.forEach(area => {
    const attention = area.attention;
    const icon = attention === "critical" ? "🚨" : "⚠️";
    const topKeywords = area.topKeywords || [];

    // Generate specific action based on area and detected keywords
    let action = generateDetailedAction(area.area, topKeywords, area.healthScore);

    insights.push({
      icon,
      title: `${area.area.charAt(0).toUpperCase() + area.area.slice(1)} Health: ${area.healthScore}%`,
      severity: attention,
      action,
      issues: area.issueCount,
      keywords: topKeywords,
    });
  });

  return insights;
}

/**
 * Generate detailed, specific recommended actions
 */
function generateDetailedAction(area, keywords, healthScore) {
  const urgency = healthScore < 40 ? "URGENT - " : healthScore < 60 ? "HIGH - " : "";
  
  const actions = {
    delivery: () => {
      let recommendation = `${urgency}Shipping & Packaging Issues Detected\n\n`;
      
      if (keywords.includes("damaged in shipping") || keywords.includes("broken package")) {
        recommendation += `📦 Critical: Package damage during transit (${keywords.filter(k => k.includes("damaged") || k.includes("broken")).length} reports)\n`;
        recommendation += `ACTION: 1) Audit packaging materials & upgrade to better protection\n`;
        recommendation += `2) Review shipping carriers - consider premium courier\n`;
        recommendation += `3) Add tracking requirement - signature on delivery\n`;
        recommendation += `4) Implement damage waiver/replacement policy\n`;
        recommendation += `TIMELINE: 1-2 weeks | OWNER: Logistics Manager`;
      } else if (keywords.includes("late delivery") || keywords.includes("delayed") || keywords.includes("took too long")) {
        recommendation += `⏱️ Delivery Speed Issue (${keywords.filter(k => k.includes("late") || k.includes("delayed") || k.includes("long")).length} reports)\n`;
        recommendation += `ACTION: 1) Analyze current delivery SLA (>3 days flagged)\n`;
        recommendation += `2) Negotiate faster shipping with carriers\n`;
        recommendation += `3) Consider local warehouses for faster fulfillment\n`;
        recommendation += `4) Implement real-time tracking notifications\n`;
        recommendation += `TIMELINE: 2-3 weeks | OWNER: Supply Chain Head`;
      } else if (keywords.includes("poor packaging")) {
        recommendation += `📮 Packaging Quality Issue - Inadequate protection\n`;
        recommendation += `ACTION: 1) Upgrade packaging to premium boxes/padding\n`;
        recommendation += `2) Add protective layers (bubble wrap, tissue paper)\n`;
        recommendation += `3) Train staff on proper packing procedures\n`;
        recommendation += `4) Run QA checks on 10% of shipments\n`;
        recommendation += `TIMELINE: 1 week | OWNER: Packaging Supplier`;
      }
      
      return recommendation;
    },
    
    product: () => {
      let recommendation = `${urgency}Product Quality Issues Detected\n\n`;
      
      if (keywords.includes("pages fell off") || keywords.includes("torn pages") || keywords.includes("broken binding")) {
        recommendation += `📖 Structural Damage: Binding/paper quality failure\n`;
        recommendation += `ACTION: 1) Audit current supplier's quality standards\n`;
        recommendation += `2) Request replacement batch from publisher\n`;
        recommendation += `3) Implement pre-shipment QC inspection\n`;
        recommendation += `4) Negotiate quality guarantee with supplier\n`;
        recommendation += `TIMELINE: 3-5 days | OWNER: Procurement`;
      } else if (keywords.includes("ink fades") || keywords.includes("cheap paper")) {
        recommendation += `✍️ Print Quality Issue - Paper/ink degradation\n`;
        recommendation += `ACTION: 1) Source premium paper supplier\n`;
        recommendation += `2) Switch to archival-grade ink if available\n`;
        recommendation += `3) Request premium printing from publisher\n`;
        recommendation += `4) Consider customer compensation program\n`;
        recommendation += `TIMELINE: 5-7 days | OWNER: Publishing Manager`;
      } else if (keywords.includes("poor quality") || keywords.includes("low quality")) {
        recommendation += `⭐ Overall Quality Below Expectations\n`;
        recommendation += `ACTION: 1) Random sample audit of 50 books\n`;
        recommendation += `2) Compare against industry standards\n`;
        recommendation += `3) Contact publisher for explanation\n`;
        recommendation += `4) Explore alternative publishers for better quality\n`;
        recommendation += `TIMELINE: 1 week | OWNER: Quality Assurance`;
      }
      
      return recommendation;
    },
    
    service: () => {
      let recommendation = `${urgency}Customer Service Breakdown\n\n`;
      
      if (keywords.includes("no support") || keywords.includes("ignored complaint")) {
        recommendation += `📞 Support Team Not Responding - Critical Issue\n`;
        recommendation += `ACTION: 1) Audit support ticket response times\n`;
        recommendation += `2) Increase support staff or extend hours\n`;
        recommendation += `3) Set up automated acknowledgment emails\n`;
        recommendation += `4) Implement 24-hour response SLA\n`;
        recommendation += `5) Escalate complaints to manager if no response in 12hrs\n`;
        recommendation += `TIMELINE: IMMEDIATE | OWNER: Customer Support Lead`;
      } else if (keywords.includes("rude staff") || keywords.includes("bad customer service")) {
        recommendation += `😞 Support Quality Issue - Staff behavior concerns\n`;
        recommendation += `ACTION: 1) Review support interactions/recordings\n`;
        recommendation += `2) Run customer service training program\n`;
        recommendation += `3) Implement quality monitoring for all chats\n`;
        recommendation += `4) Create empathy-based response templates\n`;
        recommendation += `5) Incentivize positive feedback from customers\n`;
        recommendation += `TIMELINE: 2 weeks | OWNER: HR/Support Manager`;
      } else if (keywords.includes("slow response")) {
        recommendation += `⏰ Support Response Time Too Slow\n`;
        recommendation += `ACTION: 1) Hire additional support agents\n`;
        recommendation += `2) Implement chatbot for 24/7 basic support\n`;
        recommendation += `3) Set response target: <1 hour for urgent\n`;
        recommendation += `4) Monitor response metrics daily\n`;
        recommendation += `TIMELINE: 1 week | OWNER: Support Manager`;
      }
      
      return recommendation;
    },
    
    value: () => {
      let recommendation = `${urgency}Price-Value Mismatch Detected\n\n`;
      
      if (keywords.includes("overpriced") || keywords.includes("too expensive")) {
        recommendation += `💰 Customers Feel Product Overpriced\n`;
        recommendation += `ACTION: 1) Conduct competitive pricing analysis\n`;
        recommendation += `2) Review cost structure for optimization\n`;
        recommendation += `3) Create value bundles (buy 3 get 10% off)\n`;
        recommendation += `4) Improve product descriptions/photos\n`;
        recommendation += `5) Consider seasonal discounts\n`;
        recommendation += `TIMELINE: 1-2 weeks | OWNER: Pricing/Marketing`;
      } else if (keywords.includes("not worth") || keywords.includes("wasted money")) {
        recommendation += `😞 Customers Feel They Got Poor Value\n`;
        recommendation += `ACTION: 1) Analyze what's causing low perceived value\n`;
        recommendation += `2) Address underlying quality/service issues first\n`;
        recommendation += `3) Offer satisfaction guarantee\n`;
        recommendation += `4) Implement easy return/refund process\n`;
        recommendation += `5) Send follow-up to unhappy customers\n`;
        recommendation += `TIMELINE: 2 weeks | OWNER: Product Manager`;
      }
      
      return recommendation;
    }
  };

  return actions[area] ? actions[area]() : `Review ${area} in detail and take corrective action.`;
}

module.exports = {
  analyzeSentiment,
  generateBusinessHealthReport,
  getActionableInsights,
};
