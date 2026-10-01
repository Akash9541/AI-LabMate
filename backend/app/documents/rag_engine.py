import math
import re
from typing import List, Dict, Any
from app.models.schemas import LabCitation

class LocalRAGEngine:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []

    def add_document(self, filename: str, content: str, page_count: int = 1):
        self.add_pdf_document(filename, [(1, content)])

    def add_pdf_document(self, filename: str, pages: List[tuple[int, str]]):
        for page, content in pages:
            normalized = re.sub(r"\s+", " ", content).strip()
            if normalized:
                self.documents.append({
                    "id": f"doc-{len(self.documents)+1}",
                    "doc_name": filename,
                    "page": page,
                    "content": normalized
                })

    def search(self, query: str, top_k: int = 2) -> List[LabCitation]:
        if not query:
            return []

        query_terms = set(re.findall(r'\w+', query.lower()))
        results = []

        for doc in self.documents:
            doc_terms = re.findall(r'\w+', doc["content"].lower())
            score = sum(1 for term in query_terms if term in doc_terms)
            if score > 0:
                relevance = min(0.99, 0.70 + (score * 0.08))
                results.append(
                    LabCitation(
                        doc_name=doc["doc_name"],
                        page=doc.get("page"),
                        excerpt=doc["content"],
                        relevance_score=round(relevance, 2)
                    )
                )

        results.sort(key=lambda x: x.relevance_score, reverse=True)
        return results[:top_k]

rag_engine = LocalRAGEngine()
