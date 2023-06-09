import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MealsContext } from '../../contexts/MealsContext';

import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Star from '../../components/Star/Star';

import styles from './ReviewPage.module.css';

export default function ReviewPage() {
    const navigate = useNavigate();
    const [hoverIndex, setHoverIndex] = useState(0);
    const [rating, setRating] = useState(0);
    const [meal, setMeal] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const { meals, handleModalOpen } = useContext(MealsContext);

    const handleReview = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const currentDate = new Date().toJSON().slice(0, 10);

        const review = {
            title: title,
            description: description,
            meal_id: meal,
            stars: rating,
            created_date: currentDate,
        };

        let response;
        try {
            response = await fetch(
                `${import.meta.env.VITE_APP_URL}/api/reviews`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(review),
                }
            );
        } catch (error: any) {
            throw new Error(error);
        }
        if (response.ok) {
            const data = await response.json();
            setMeal('');
            setTitle('');
            setDescription('');
            setRating(0);
            handleModalOpen();
            setTimeout(() => navigate('/meals'), 1200);
        }
    };

    return (
        <main className={styles.main}>
            <h2 className={styles.title}>
                Savor our dishes? <br /> Share your thoughts and help foodies
                choose! <br />
            </h2>
            <form className={styles.form} onSubmit={handleReview}>
                <select
                    className={styles.selectList}
                    value={meal}
                    onChange={e => setMeal(e.target.value)}
                >
                    <option value=''>Select a meal</option>
                    {meals.map(meal => (
                        <option value={meal.id} key={meal.id}>
                            {meal.title}
                        </option>
                    ))}
                </select>
                <input
                    required
                    type='text'
                    placeholder='title'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <textarea
                    cols={50}
                    rows={12}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>

                <ul className={styles.starList}>
                    {[1, 2, 3, 4, 5].map(index => {
                        return (
                            <li
                                className={styles.starListItem}
                                key={index}
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(0)}
                                onClick={() => setRating(index)}
                            >
                                <Star
                                    yellow={
                                        index <= hoverIndex || index <= rating
                                    }
                                />
                            </li>
                        );
                    })}
                </ul>
                <Button text={'Send Review'} />
            </form>
            <Modal text={'Review'} />
        </main>
    );
}
