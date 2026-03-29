"""
Jargon translator service - detects and explains financial terms.
"""

import re
from typing import Optional

# Financial jargon dictionary with plain-English explanations
JARGON_DICTIONARY = {
    # Basic terms
    "stock": "A tiny piece of ownership in a company. When you buy a stock, you become a part-owner!",
    "bond": "A loan you give to a company or government. They pay you back with interest.",
    "dividend": "Money a company shares with its owners (stockholders) from its profits.",
    "portfolio": "Your collection of investments - think of it like a basket holding all your financial eggs.",
    "asset": "Anything valuable you own that could make you money.",
    
    # Market terms
    "bull market": "When prices are going up and investors are optimistic - like a bull charging forward!",
    "bear market": "When prices are falling and investors are worried - like a bear hibernating.",
    "volatility": "How much prices jump around. High volatility = a bumpy ride.",
    "liquidity": "How easily you can turn something into cash. Cash is the most liquid!",
    "market cap": "The total value of all a company's shares. Big company = big market cap.",
    
    # Investment vehicles
    "etf": "Exchange-Traded Fund - a basket of stocks you can buy all at once, like a sampler platter.",
    "index fund": "A fund that copies a market index (like the S&P 500). Simple and usually low-cost.",
    "mutual fund": "Money pooled from many investors to buy a mix of stocks/bonds, managed by pros.",
    "401k": "A retirement savings account through your job, often with free money (matching) from your employer!",
    "ira": "Individual Retirement Account - a personal retirement savings account with tax benefits.",
    "roth ira": "A retirement account where you pay taxes now, but withdrawals in retirement are tax-free.",
    
    # Risk terms
    "diversification": "Spreading your money across different investments. Don't put all eggs in one basket!",
    "risk tolerance": "How much financial rollercoaster you can handle without panicking.",
    "compound interest": "When your earnings make earnings. Your money making babies that make babies!",
    "inflation": "When prices go up over time, making each dollar worth less.",
    
    # Trading terms
    "broker": "A middleman who helps you buy and sell investments.",
    "commission": "A fee you pay when buying or selling investments.",
    "expense ratio": "The yearly fee a fund charges, shown as a percentage. Lower is better!",
    "capital gains": "Profit from selling an investment for more than you paid.",
    "capital loss": "When you sell an investment for less than you paid. Ouch.",
    
    # Analysis terms
    "p/e ratio": "Price-to-Earnings ratio - compares stock price to company profits. Helps see if it's expensive.",
    "yield": "The income your investment produces, shown as a percentage.",
    "roi": "Return on Investment - how much profit you made compared to what you put in.",
    "benchmark": "A standard to compare your investments against (like the S&P 500).",
    
    # Advanced terms
    "hedge": "An investment made to reduce risk in another investment. Like insurance for your portfolio.",
    "derivative": "A financial contract whose value depends on something else (like stock prices).",
    "short selling": "Betting that a stock will go down. Risky business!",
    "margin": "Borrowing money to invest. Can amplify gains AND losses.",
    "rebalancing": "Adjusting your portfolio back to your target mix. Keeping things balanced.",
}

# Compile regex patterns for each term
JARGON_PATTERNS = {
    term: re.compile(rf'\b{re.escape(term)}\b', re.IGNORECASE)
    for term in JARGON_DICTIONARY.keys()
}


def detect_jargon(text: str) -> list[dict]:
    """
    Detect financial jargon in text and return explanations.
    
    Returns:
        List of dicts with 'term' and 'explanation' keys
    """
    detected = []
    text_lower = text.lower()
    
    for term, pattern in JARGON_PATTERNS.items():
        if pattern.search(text):
            detected.append({
                "term": term,
                "explanation": JARGON_DICTIONARY[term]
            })
    
    return detected


def get_definition(term: str) -> Optional[str]:
    """Get the definition of a specific term."""
    term_lower = term.lower().strip()
    return JARGON_DICTIONARY.get(term_lower)


def add_jargon_tooltips(text: str) -> str:
    """
    Add HTML tooltip markup to jargon terms in text.
    Useful for frontend rendering.
    """
    result = text
    for term, explanation in JARGON_DICTIONARY.items():
        pattern = JARGON_PATTERNS[term]
        replacement = f'<span class="jargon" data-tooltip="{explanation}">\\g<0></span>'
        result = pattern.sub(replacement, result)
    return result


def suggest_related_terms(term: str) -> list[str]:
    """Suggest related financial terms based on input."""
    term_lower = term.lower()
    
    # Category groupings
    categories = {
        "basics": ["stock", "bond", "dividend", "portfolio", "asset"],
        "retirement": ["401k", "ira", "roth ira", "compound interest"],
        "funds": ["etf", "index fund", "mutual fund"],
        "risk": ["diversification", "risk tolerance", "volatility"],
        "trading": ["broker", "commission", "capital gains", "capital loss"],
    }
    
    # Find which category the term belongs to
    for category, terms in categories.items():
        if term_lower in terms:
            # Return other terms in same category
            return [t for t in terms if t != term_lower]
    
    # Default: return beginner terms
    return categories["basics"][:3]
